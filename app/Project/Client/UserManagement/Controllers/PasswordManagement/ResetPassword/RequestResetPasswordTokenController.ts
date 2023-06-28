import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SUCCESS,
  VALIDATION_ERROR,
  SOMETHING_WENT_WRONG,
  SENT_EMAIL_OTP_CHECK_EMAIL,
} from 'App/Common/Helpers/Messages/SystemMessages'
import RequestResetPasswordTokenRequestValidator from 'App/Project/Client/UserManagement/Validators/PasswordManagement/ResetPassword/RequestResetPasswordTokenRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import OtpTokenActions from 'App/Project/Client/UserManagement/Actions/OtpTokenActions'
import businessConfig from 'Config/businessConfig'
import MailClient from 'App/InfrastructureProviders/Internal/MailClient'
import UserActions from 'App/Project/Client/UserManagement/Actions/UserActions'

export default class RequestResetPasswordTokenController {
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
        await request.validate(RequestResetPasswordTokenRequestValidator)
      } catch (ValidationError) {
        await dbTransaction.rollback()
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }

      await dbTransaction.commit()

      const { email } = request.body()

      const user = (await UserActions.getUserRecord({
        identifier: email,
        identifierType: 'email',
      }))!

      const activePasswordResetToken = await OtpTokenActions.getActiveOtpToken({
        email,
        tokenType: 'reset-password',
      })

      if (activePasswordResetToken)
        await OtpTokenActions.revokeExistingOtpToken(activePasswordResetToken.id)

      const token = OtpTokenActions.generateOtpToken(businessConfig.otpToken.tokenLength)

      await OtpTokenActions.createOtpTokenRecord({
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
        createPayload: {
          tokenType: 'reset-password',
          email,
          token,
        },
      })

      await MailClient.sendPasswordResetOtpEmail({
        userFirstName: user.firstName,
        userFullName: user.fullName,
        loginOtpToken: token,
        userEmail: user.email,
      })

      await dbTransaction.commit()

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: SENT_EMAIL_OTP_CHECK_EMAIL,
      })
    } catch (RequestResetPasswordTokenControllerError) {
      console.log(
        '🚀 ~ RequestResetPasswordTokenControllerError.handle RequestResetPasswordTokenControllerError ->',
        RequestResetPasswordTokenControllerError
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
