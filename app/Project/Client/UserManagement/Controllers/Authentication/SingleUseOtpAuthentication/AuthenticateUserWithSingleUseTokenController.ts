import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SUCCESS,
  VALIDATION_ERROR,
  SOMETHING_WENT_WRONG,
  NULL_OBJECT,
  INVALID_CREDENTIALS,
  INVALID_EMAIL_OTP,
  EMAIL_EXPIRED_OTP_REQUEST_NEW_TOKEN,
  AUTHENTICATION_SUCCESSFUL,
} from 'App/Common/Helpers/Messages/SystemMessages'
import AuthenticateUserWithSingleUseCodeRequestValidator from 'App/Project/Client/UserManagement/Validators/Authentication/SingleUseOtpAuthentication/AuthenticateUserWithSingleUseCodeRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import OtpTokenActions from 'App/Project/Client/UserManagement/Actions/OtpTokenActions'
import hasFutureDateTimeElapsed from 'App/Common/Helpers/DateManagement/hasFutureDateTimeElapsed'
import businessConfig from 'Config/businessConfig'
import UserActions from 'App/Project/Client/UserManagement/Actions/UserActions'

export default class AuthenticateUserWithSingleUseTokenController {
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
        await request.validate(AuthenticateUserWithSingleUseCodeRequestValidator)
      } catch (ValidationError) {
        await dbTransaction.rollback()
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }

      const { email, otp_token: otpToken } = request.body()

      const user = (await UserActions.getUserRecordByEmail(email))!

      const activeLoginToken = await OtpTokenActions.getActiveOtpToken({
        email,
        tokenType: 'login',
      })

      if (activeLoginToken === NULL_OBJECT) {
        await dbTransaction.rollback()

        return response.status(this.badRequest).send({
          status_code: this.badRequest,
          status: SUCCESS,
          message: INVALID_CREDENTIALS,
        })
      }

      if (activeLoginToken.token !== otpToken) {
        await dbTransaction.rollback()

        return response.status(this.badRequest).send({
          status: ERROR,
          status_code: this.badRequest,
          message: INVALID_EMAIL_OTP,
        })
      }

      const OTP_TOKEN_HAS_EXPIRED = true

      const hasOtpTokenExpired = hasFutureDateTimeElapsed({
        futureDateTime: activeLoginToken.expiresAt,
      })

      if (hasOtpTokenExpired === OTP_TOKEN_HAS_EXPIRED) {
        await dbTransaction.rollback()

        await OtpTokenActions.revokeExistingOtpToken(activeLoginToken.id)

        return response.status(this.badRequest).send({
          status_code: this.badRequest,
          status: ERROR,
          message: EMAIL_EXPIRED_OTP_REQUEST_NEW_TOKEN,
        })
      }
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

      await OtpTokenActions.revokeExistingOtpToken(activeLoginToken.id)

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
    } catch (AuthenticateUserWithSingleUseCodeControllerError) {
      console.log(
        '🚀 ~ AuthenticateUserWithSingleUseCodeControllerError.handle AuthenticateUserWithSingleUseCodeControllerError ->',
        AuthenticateUserWithSingleUseCodeControllerError
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
