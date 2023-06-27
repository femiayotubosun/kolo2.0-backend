import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  VALIDATION_ERROR,
} from 'App/Common/Helpers/Messages/SystemMessages'
import RequestSingleUseAuthenticationCodeRequestValidator from 'App/Project/Client/UserManagement/Validators/Authentication/SingleUseOtpAuthentication/RequestSingleUseAuthenticationCodeRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import OtpTokenActions from 'App/Project/Client/UserManagement/Actions/OtpTokenActions'
import businessConfig from 'Config/businessConfig'
import UserActions from 'App/Project/Client/UserManagement/Actions/UserActions'
import MailClient from 'App/InfrastructureProviders/Internal/MailClient'

export default class RequestSingleUseAuthenticationCodeController {
  /*
  |--------------------------------------------------------------------------------
  | Status Codes
  |--------------------------------------------------------------------------------
  |
  */
  private ok = HttpStatusCodeEnum.OK
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
  public async handle({ request, response }: HttpContextContract) {
    const dbTransaction = await Database.transaction()

    try {
      try {
        await request.validate(RequestSingleUseAuthenticationCodeRequestValidator)
      } catch (ValidationError) {
        await dbTransaction.rollback()
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }

      const { email } = request.body()

      const user = (await UserActions.getUserRecordByEmail(email))!

      const activeOtpToken = await OtpTokenActions.getActiveOtpToken({
        email,
        tokenType: 'login',
      })

      if (activeOtpToken) {
        await OtpTokenActions.revokeExistingOtpToken(activeOtpToken.id)
      }

      const token = OtpTokenActions.generateOtpToken(businessConfig.otpToken.tokenLength)

      await OtpTokenActions.createOtpTokenRecord({
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
        createPayload: {
          tokenType: 'login',
          email,
          token,
        },
      })

      await MailClient.sendLoginOtpEmail({
        userFirstName: user.firstName,
        userFullName: user.fullName,
        loginOtpToken: token,
        userEmail: user.email,
      })

      await dbTransaction.commit()

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: '',
      })
    } catch (RequestSingleUseAuthenticationCodeControllerError) {
      console.log(
        '🚀 ~ RequestSingleUseAuthenticationCodeControllerError.handle RequestSingleUseAuthenticationCodeControllerError ->',
        RequestSingleUseAuthenticationCodeControllerError
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
