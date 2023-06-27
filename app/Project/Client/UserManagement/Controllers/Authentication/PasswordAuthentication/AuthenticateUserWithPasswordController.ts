import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SUCCESS,
  VALIDATION_ERROR,
  SOMETHING_WENT_WRONG,
  INVALID_CREDENTIALS,
  AUTHENTICATION_SUCCESSFUL,
  NULL_OBJECT,
} from 'App/Common/Helpers/Messages/SystemMessages'
import AuthenticateUserWithPasswordRequestValidator from 'App/Project/Client/UserManagement/Validators/Authentication/AuthenticateUserWithPasswordRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import UserActions from 'App/Project/Client/UserManagement/Actions/UserActions'
import businessConfig from 'Config/businessConfig'

export default class AuthenticateUserWithPasswordController {
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
        await request.validate(AuthenticateUserWithPasswordRequestValidator)
      } catch (ValidationError) {
        await dbTransaction.rollback()
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }

      const { email, password } = request.body()

      const user = await UserActions.getUserRecord({
        identifierType: 'email',
        identifier: email,
      })

      if (user === NULL_OBJECT) {
        await dbTransaction.rollback()
        return response.status(this.badRequest).send({
          status_code: this.badRequest,
          status: ERROR,
          message: INVALID_CREDENTIALS,
        })
      }

      // Check User Type
      const PASSWORD_DOES_NOT_MATCH = false

      const passwordMatch = await Hash.verify(user!.password!, password)

      if (passwordMatch === PASSWORD_DOES_NOT_MATCH) {
        await dbTransaction.rollback()

        return response.status(this.badRequest).send({
          status_code: this.badRequest,
          status: ERROR,
          message: INVALID_CREDENTIALS,
        })
      }
      await auth.use('api').revoke()

      const accessToken = await auth.use('api').attempt(email, password, {
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
    } catch (AuthenticateUserWithPasswordControllerError) {
      console.log(
        '🚀 ~ AuthenticateUserWithPasswordControllerError.handle AuthenticateUserWithPasswordControllerError ->',
        AuthenticateUserWithPasswordControllerError
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
