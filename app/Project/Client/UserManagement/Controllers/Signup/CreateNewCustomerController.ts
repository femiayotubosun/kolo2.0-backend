import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SUCCESS,
  VALIDATION_ERROR,
  SOMETHING_WENT_WRONG,
  SIGN_UP_SUCCESSFUL,
} from 'App/Common/Helpers/Messages/SystemMessages'
import CreateNewCustomerRequestValidator from 'App/Project/Client/UserManagement/Validators/Signup/CreateNewCustomerRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import businessConfig from 'Config/businessConfig'
import UserActions from 'App/Project/Client/UserManagement/Actions/UserActions'

export default class CreateNewCustomerController {
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
        await request.validate(CreateNewCustomerRequestValidator)
      } catch (ValidationError) {
        await dbTransaction.commit()
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }

      const {
        email,
        first_name: firstName,
        last_name: lastName,
        mobile_number: mobileNumber,
        password,
      } = request.body()

      const currentDateTime = businessConfig.currentDateTime()

      await UserActions.createUserRecord({
        createPayload: {
          email,
          firstName,
          lastName,
          mobileNumber,
          password,
          lastLoginDate: currentDateTime,
        },
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
      })

      // TODO create user profile

      // Todo create registration steps

      // TODO add username to signup

      await dbTransaction.commit()

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: SIGN_UP_SUCCESSFUL,
      })
    } catch (CreateNewCustomerControllerError) {
      console.log(
        '🚀 ~ CreateNewCustomerControllerError.handle CreateNewCustomerControllerError ->',
        CreateNewCustomerControllerError
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
