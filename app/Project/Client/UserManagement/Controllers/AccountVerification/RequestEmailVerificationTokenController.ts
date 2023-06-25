import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SUCCESS,
  SOMETHING_WENT_WRONG,
  INFORMATION_ALREADY_VERIFIED,
  ACCOUNT_ACTIVATION_REQUIRED_SUBJECT,
  RESEND_OTP_ACCOUNT_ACTIVATION_EMAIL_TEMPLATE,
  SENT_EMAIL_OTP_CHECK_EMAIL,
} from 'App/Common/Helpers/Messages/SystemMessages'
import OtpTokenActions from 'App/Project/Client/UserManagement/Actions/OtpTokenActions'
import businessConfig from 'Config/businessConfig'
import CreateOtpTokenRecordOptions from 'App/Project/Client/UserManagement/TypeChecking/OtpToken/CreateOtpTokenRecordOptions'
import EmailOptionsInterface from 'App/InfrastructureProviders/Internal/TypeChecking/EmailOptionsInterface'
import MailClient from 'App/InfrastructureProviders/Internal/MailClient'

export default class RequestEmailVerificationTokenController {
  /*
  |--------------------------------------------------------------------------------
  | Status Codes
  |--------------------------------------------------------------------------------
  |
  */
  private ok = HttpStatusCodeEnum.OK
  private internalServerError = HttpStatusCodeEnum.INTERNAL_SERVER_ERROR

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
  public async handle({ response, auth }: HttpContextContract) {
    try {
      const user = auth.user!

      if (user!.hasVerifiedEmail === 'Yes') {
        return response.status(this.ok).send({
          status_code: this.ok,
          status: SUCCESS,
          message: INFORMATION_ALREADY_VERIFIED,
        })
      }

      const existingOtpToken = await OtpTokenActions.getActiveOtpToken({
        email: user.email,
        tokenType: 'email-verification',
      })

      if (existingOtpToken) {
        await OtpTokenActions.revokeExistingOtpToken(existingOtpToken.id)
      }

      const token = OtpTokenActions.generateOtpToken(businessConfig.otpToken.tokenLength)

      const createOtpTokenOptions: CreateOtpTokenRecordOptions = {
        dbTransactionOptions: {
          useTransaction: false,
        },
        createPayload: {
          email: user.email,
          token,
          tokenType: 'email-verification',
        },
      }

      const resendOtpTokenEmailOptions: EmailOptionsInterface = {
        recipientName: user.fullName,
        recipientEmail: user.email,
        emailSubject: ACCOUNT_ACTIVATION_REQUIRED_SUBJECT,
        emailTemplate: RESEND_OTP_ACCOUNT_ACTIVATION_EMAIL_TEMPLATE,
        emailPayload: {
          token,
          recipientFirstName: user.firstName,
        },
      }

      await OtpTokenActions.createOtpTokenRecord(createOtpTokenOptions)

      await MailClient.sendMail(resendOtpTokenEmailOptions)

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: SENT_EMAIL_OTP_CHECK_EMAIL,
      })
    } catch (RequestEmailVerificationTokenControllerError) {
      console.log(
        '🚀 ~ RequestEmailVerificationTokenControllerError.handle RequestEmailVerificationTokenControllerError ->',
        RequestEmailVerificationTokenControllerError
      )

      return response.status(this.internalServerError).send({
        status_code: this.internalServerError,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
