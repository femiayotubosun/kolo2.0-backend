import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  CHANGE_PASSWORD_SUCCESS,
  ERROR,
  INVALID_CREDENTIALS,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  VALIDATION_ERROR,
} from 'App/Common/Helpers/Messages/SystemMessages'
import ChangePasswordRequestValidator from 'App/Project/Client/UserManagement/Validators/PasswordManagement/ChangePassword/ChangePasswordRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import businessConfig from 'Config/businessConfig'
import UserActions from 'App/Project/Client/UserManagement/Actions/UserActions'

export default class ChangePasswordController {
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
        await request.validate(ChangePasswordRequestValidator)
      } catch (ValidationError) {
        await dbTransaction.rollback()
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }
      const { oldPassword, newPassword } = request.body()
      const user = auth.user!

      const PASSWORD_DOES_NOT_MATCH = false

      const passwordMatch = await Hash.verify(user!.password!, oldPassword)

      if (passwordMatch === PASSWORD_DOES_NOT_MATCH) {
        await dbTransaction.rollback()
        return response.status(this.badRequest).send({
          status_code: this.badRequest,
          status: ERROR,
          message: INVALID_CREDENTIALS,
        })
      }

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
          password: newPassword,
          lastLoginDate: currentLoginDate,
        },
      })

      await dbTransaction.commit()

      await auth.use('api').revoke()

      const accessToken = await auth.use('api').attempt(user!.email, newPassword, {
        expiresIn: `${businessConfig.accessTokenExpirationTimeFrame} minutes`,
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

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: CHANGE_PASSWORD_SUCCESS,
        results: mutatedUserPayload,
      })
    } catch (ChangePasswordControllerError) {
      console.log(
        '🚀 ~ ChangePasswordControllerError.handle ChangePasswordControllerError ->',
        ChangePasswordControllerError
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
