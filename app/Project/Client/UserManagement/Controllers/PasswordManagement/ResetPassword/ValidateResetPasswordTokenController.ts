import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  AUTHENTICATION_SUCCESSFUL,
  EMAIL_EXPIRED_OTP_REQUEST_NEW_TOKEN,
  ERROR,
  INVALID_TOKEN,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  VALIDATION_ERROR,
} from 'App/Common/Helpers/Messages/SystemMessages'
import ValidateResetPasswordTokenRequestValidator from 'App/Project/Client/UserManagement/Validators/PasswordManagement/ResetPassword/ValidateResetPasswordTokenRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import UserActions from 'App/Project/Client/UserManagement/Actions/UserActions'
import OtpTokenActions from 'App/Project/Client/UserManagement/Actions/OtpTokenActions'
import hasFutureDateTimeElapsed from 'App/Common/Helpers/DateManagement/hasFutureDateTimeElapsed'
import businessConfig from 'Config/businessConfig'

export default class ValidateResetPasswordTokenController {
  /*
  |--------------------------------------------------------------------------------
  | Status Codes
  |--------------------------------------------------------------------------------
  |
  */
  private ok = HttpStatusCodeEnum.OK
  private internalServerError = HttpStatusCodeEnum.INTERNAL_SERVER_ERROR
  private unprocessableEntity = HttpStatusCodeEnum.UNPROCESSABLE_ENTITY
  private badRequest = HttpStatusCodeEnum.BAD_REQUEST

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
        await request.validate(ValidateResetPasswordTokenRequestValidator)
      } catch (ValidationError) {
        await dbTransaction.rollback()
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }

      const { otpToken } = request.body()

      const activeResetPasswordToken = await OtpTokenActions.getOtpTokenRecord({
        identifier: otpToken,
        identifierType: 'token',
      })

      if (activeResetPasswordToken === NULL_OBJECT) {
        await dbTransaction.rollback()

        return response.status(this.badRequest).send({
          status_code: this.badRequest,
          status: SUCCESS,
          message: INVALID_TOKEN,
        })
      }

      if (activeResetPasswordToken.token !== otpToken) {
        await dbTransaction.rollback()

        return response.status(this.badRequest).send({
          status: ERROR,
          status_code: this.badRequest,
          message: INVALID_TOKEN,
        })
      }

      const OTP_TOKEN_HAS_EXPIRED = true

      const hasOtpTokenExpired = hasFutureDateTimeElapsed({
        futureDateTime: activeResetPasswordToken.expiresAt,
      })

      if (hasOtpTokenExpired === OTP_TOKEN_HAS_EXPIRED) {
        await dbTransaction.rollback()

        await OtpTokenActions.revokeExistingOtpToken(activeResetPasswordToken.id)

        return response.status(this.badRequest).send({
          status_code: this.badRequest,
          status: ERROR,
          message: EMAIL_EXPIRED_OTP_REQUEST_NEW_TOKEN,
        })
      }

      const user = (await UserActions.getUserRecordByEmail(activeResetPasswordToken.email))!

      const accessToken = await auth.use('api').generate(user, {
        expiresIn: `${businessConfig.accessTokenExpirationTimeFrame} minutes`,
      })

      const currentLoginDate = businessConfig.currentDateTime()

      await UserActions.updateUserRecord({
        dbTransactionOptions: {
          dbTransaction,
          useTransaction: true,
        },
        identifierOptions: {
          identifier: user!.id,
          identifierType: 'id',
        },
        updatePayload: {
          lastLoginDate: currentLoginDate,
        },
      })

      await OtpTokenActions.revokeExistingOtpToken(activeResetPasswordToken.id)

      const mutatedUserPayload = {
        identifier: user!.identifier,
        first_name: user!.firstName,
        last_name: user!.lastName,
        full_name: user!.fullName,
        email: user!.email,
        access_credentials: accessToken,
        meta: {
          has_verified_email: user!.hasVerifiedEmail,
          last_login_date: currentLoginDate,
        },
        created_at: user!.createdAt,
      }

      await dbTransaction.commit()

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: AUTHENTICATION_SUCCESSFUL,
        results: mutatedUserPayload,
      })
    } catch (ValidateResetPasswordTokenControllerError) {
      console.log(
        '🚀 ~ ValidateResetPasswordTokenControllerError.handle ValidateResetPasswordTokenControllerError ->',
        ValidateResetPasswordTokenControllerError
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
