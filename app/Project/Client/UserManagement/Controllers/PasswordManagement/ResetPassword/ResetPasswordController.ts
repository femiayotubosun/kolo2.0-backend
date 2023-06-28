import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  USER_PASSWORD_MODIFICATION_SUCCESSFUL,
  VALIDATION_ERROR,
} from 'App/Common/Helpers/Messages/SystemMessages'
import ResetPasswordRequestValidator from 'App/Project/Client/UserManagement/Validators/PasswordManagement/ResetPassword/ResetPasswordRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import UserActions from 'App/Project/Client/UserManagement/Actions/UserActions'
import businessConfig from 'Config/businessConfig'

export default class ResetPasswordController {
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
  public async handle({ request, response, auth }: HttpContextContract) {
    const dbTransaction = await Database.transaction()

    try {
      try {
        await request.validate(ResetPasswordRequestValidator)
      } catch (ValidationError) {
        await dbTransaction.rollback()
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }
      const user = auth.user!

      const { password } = request.body()

      await auth.use('api').revoke()

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
          password,
        },
      })

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
        status: SUCCESS,
        status_code: this.ok,
        message: USER_PASSWORD_MODIFICATION_SUCCESSFUL,
        results: mutatedUserPayload,
      })
    } catch (ResetPasswordControllerError) {
      console.log(
        '🚀 ~ ResetPasswordControllerError.handle ResetPasswordControllerError ->',
        ResetPasswordControllerError
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
