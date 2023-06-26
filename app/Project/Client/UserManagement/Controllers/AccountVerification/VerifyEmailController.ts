import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SUCCESS,
  VALIDATION_ERROR,
  SOMETHING_WENT_WRONG,
  INFORMATION_ALREADY_VERIFIED,
  INVALID_EMAIL_OTP,
  NULL_OBJECT,
  EMAIL_EXPIRED_OTP_REQUEST_NEW_TOKEN,
  INFORMATION_VERIFIED,
} from 'App/Common/Helpers/Messages/SystemMessages'
import VerifyEmailRequestValidator from 'App/Project/Client/UserManagement/Validators/AccountVerification/VerifyEmailRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import OtpTokenActions from 'App/Project/Client/UserManagement/Actions/OtpTokenActions'
import hasFutureDateTimeElapsed from 'App/Common/Helpers/DateManagement/hasFutureDateTimeElapsed'
import UserActions from 'App/Project/Client/UserManagement/Actions/UserActions'

export default class VerifyEmailController {
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
        await request.validate(VerifyEmailRequestValidator)
      } catch (ValidationError) {
        await dbTransaction.rollback()
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }

      const { otp_token: otpToken } = request.body()
      const user = auth.user
      const userId = user!.id

      const HAS_VERIFIED_EMAIL = 'Yes'

      if (user!.hasVerifiedEmail === HAS_VERIFIED_EMAIL) {
        await dbTransaction.rollback()
        return response.status(this.ok).send({
          status: SUCCESS,
          status_code: this.ok,
          message: INFORMATION_ALREADY_VERIFIED,
        })
      }

      const existingOtpToken = await OtpTokenActions.getActiveOtpToken({
        email: user!.email,
        tokenType: 'email-verification',
      })

      if (existingOtpToken === NULL_OBJECT) {
        await dbTransaction.rollback()
        return response.status(this.badRequest).send({
          status_code: this.badRequest,
          status: ERROR,
          message: INVALID_EMAIL_OTP,
        })
      }

      if (existingOtpToken.token !== otpToken) {
        await dbTransaction.rollback()
        return response.status(this.badRequest).send({
          status: ERROR,
          status_code: this.badRequest,
          message: INVALID_EMAIL_OTP,
        })
      }

      const OTP_TOKEN_HAS_EXPIRED = true

      const hasOtpTokenExpired = hasFutureDateTimeElapsed({
        futureDateTime: existingOtpToken.expiresAt,
      })

      if (hasOtpTokenExpired === OTP_TOKEN_HAS_EXPIRED) {
        await dbTransaction.rollback()
        await OtpTokenActions.revokeExistingOtpToken(existingOtpToken.id)

        return response.status(this.badRequest).send({
          status_code: this.badRequest,
          status: ERROR,
          message: EMAIL_EXPIRED_OTP_REQUEST_NEW_TOKEN,
        })
      }

      await UserActions.updateUserRecord({
        dbTransactionOptions: {
          dbTransaction,
          useTransaction: true,
        },
        identifierOptions: {
          identifier: userId,
          identifierType: 'id',
        },
        updatePayload: {
          hasVerifiedEmail: true,
        },
      })
      await OtpTokenActions.revokeExistingOtpToken(existingOtpToken.id)

      await dbTransaction.commit()

      return response.status(this.ok).send({
        status: SUCCESS,
        status_code: this.ok,
        message: INFORMATION_VERIFIED,
      })
    } catch (VerifyEmailControllerError) {
      console.log(
        '🚀 ~ VerifyEmailControllerError.handle VerifyEmailControllerError ->',
        VerifyEmailControllerError
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
