import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SUCCESS,
  VALIDATION_ERROR,
  SOMETHING_WENT_WRONG,
} from 'App/Common/Helpers/Messages/SystemMessages'
import AuthenticateUserWithSingleUseCodeRequestValidator from 'App/Project/Client/UserManagement/Validators/Authentication/SingleUseOtpAuthentication/AuthenticateUserWithSingleUseCodeRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthenticateUserWithSingleUseCodeController {
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

      await dbTransaction.commit()

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: '',
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
