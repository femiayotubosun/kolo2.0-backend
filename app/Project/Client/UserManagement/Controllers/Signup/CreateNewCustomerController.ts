import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  NO_INFORMATION,
  NULL_OBJECT,
  SIGN_UP_SUCCESSFUL,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  USER_CREATION_ERROR,
  VALIDATION_ERROR,
} from 'App/Common/Helpers/Messages/SystemMessages'
import CreateNewCustomerRequestValidator from 'App/Project/Client/UserManagement/Validators/Signup/CreateNewCustomerRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import businessConfig from 'Config/businessConfig'
import UserActions from 'App/Project/Client/UserManagement/Actions/UserActions'
import UserProfileActions from 'App/Project/Client/UserManagement/Actions/UserProfileActions'
import UserRegistrationStepActions from 'App/Project/Client/UserManagement/Actions/UserRegistrationStepActions'
import OtpTokenActions from 'App/Project/Client/UserManagement/Actions/OtpTokenActions'
import { Queue } from '@ioc:Setten/Queue'

export default class CreateNewCustomerController {
  /*
  |--------------------------------------------------------------------------------
  | Status Codes
  |--------------------------------------------------------------------------------
  |
  */
  private created = HttpStatusCodeEnum.CREATED
  private internalServerError = HttpStatusCodeEnum.INTERNAL_SERVER_ERROR
  private unprocessableEntity = HttpStatusCodeEnum.UNPROCESSABLE_ENTITY

  /*
  |--------------------------------------------------------------------------------
  | Systems
  |--------------------------------------------------------------------------------
  |
  */

  /*
  |--------------------------------------------------------------------------------
  | Handle Request
  |--------------------------------------------------------------------------------
  |
  */
  public async handle({ request, response, auth }: HttpContextContract) {
    const dbTransaction = await Database.transaction()

    try {
      try {
        await request.validate(CreateNewCustomerRequestValidator)
      } catch (ValidationError) {
        await dbTransaction.rollback()
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }

      const {
        email,
        first_name: firstName,
        last_name: lastName,
        mobile_number: mobileNumber,
        username,
        password,
      } = request.body()

      const currentDateTime = businessConfig.currentDateTime()

      const newUser = await UserActions.createUserRecord({
        createPayload: {
          email,
          firstName,
          lastName,
          mobileNumber,
          password,
          lastLoginDate: currentDateTime,
        },
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
      })

      const referralCode = UserProfileActions.generateReferralCode()
      const customerCode = UserProfileActions.generateCustomerCode()

      await UserProfileActions.createUserProfileRecord({
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
        createPayload: {
          username,
          referralCode,
          customerCode,
          userId: newUser.id,
        },
      })

      await UserRegistrationStepActions.createUserRegistrationStepRecord({
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
        createPayload: {
          userId: newUser.id,
        },
      })

      await dbTransaction.commit()

      const newUserRecord = await UserActions.getUserRecord({
        identifier: email,
        identifierType: 'email',
      })

      if (newUserRecord === NULL_OBJECT) {
        return response.status(this.internalServerError).send({
          status_code: this.internalServerError,
          status: ERROR,
          message: USER_CREATION_ERROR,
        })
      }

      const accessToken = await auth.use('api').attempt(email, password, {
        expiresIn: `${businessConfig.otpToken.expirationTimeFrame} minutes`,
      })

      const token = OtpTokenActions.generateOtpToken(businessConfig.otpToken.tokenLength)

      await OtpTokenActions.createOtpTokenRecord({
        createPayload: {
          tokenType: 'email-verification',
          email: newUserRecord.email,
          token,
        },
        dbTransactionOptions: {
          useTransaction: false,
        },
      })

      const mutatedCustomerPayload = {
        identifier: newUserRecord.identifier,
        first_name: newUserRecord.firstName,
        last_name: newUserRecord.lastName,
        full_name: newUserRecord.fullName,
        email: newUserRecord.email,
        mobile_number: newUserRecord.mobileNumber,
        access_credentials: accessToken,
        meta: {
          has_verified_email: newUserRecord.hasVerifiedEmail,
          last_login_date:
            newUserRecord.lastLoginDate === NULL_OBJECT
              ? NO_INFORMATION
              : newUserRecord.lastLoginDate,
        },
        created_at: newUserRecord.createdAt,
      }

      await Queue.dispatch('App/Project/Client/UserManagement/Jobs/SendEmailOtpTokenConsumer', {
        email: newUserRecord.email,
        fullName: newUserRecord.fullName,
        firstName: newUserRecord.firstName,
        token,
      })

      return response.status(this.created).send({
        status_code: this.created,
        status: SUCCESS,
        message: SIGN_UP_SUCCESSFUL,
        results: mutatedCustomerPayload,
      })
    } catch (CreateNewCustomerControllerError) {
      console.log(
        '🚀 ~ CreateNewCustomerControllerError.handle CreateNewCustomerControllerError ->',
        CreateNewCustomerControllerError
      )

      await dbTransaction.rollback()

      return response.status(this.internalServerError).send({
        status_code: this.internalServerError,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
