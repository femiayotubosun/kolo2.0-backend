import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SUCCESS,
  VALIDATION_ERROR,
  SOMETHING_WENT_WRONG,
  GOOD_USERNAME_CHOICE,
} from 'App/Common/Helpers/Messages/SystemMessages'
import CheckUsernameAvailabilityRequestValidator from 'App/Project/Client/UserManagement/Validators/Signup/CheckUsernameAvailabilityRequestValidator'

export default class CheckUsernameAvailabilityController {
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
    try {
      try {
        await request.validate(CheckUsernameAvailabilityRequestValidator)
      } catch (ValidationError) {
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: GOOD_USERNAME_CHOICE,
      })
    } catch (CheckUsernameAvailabilityControllerError) {
      console.log(
        '🚀 ~ CheckUsernameAvailabilityControllerError.handle CheckUsernameAvailabilityControllerError ->',
        CheckUsernameAvailabilityControllerError
      )

      return response.status(this.internalServerError).send({
        status_code: this.internalServerError,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
