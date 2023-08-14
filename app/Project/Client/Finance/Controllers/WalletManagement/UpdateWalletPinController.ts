import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SUCCESS,
  VALIDATION_ERROR,
  SOMETHING_WENT_WRONG,
} from 'App/Common/Helpers/Messages/SystemMessages'
import UpdateWalletPinRequestValidator from 'App/Project/Client/Finance/Validators/WalletManagement/UpdateWalletPinRequestValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import WalletActions from 'App/Project/Client/Finance/Actions/WalletActions'
import { OPERATION_SUCCESSFUL } from 'App/Common/Helpers/Messages/SystemMessageFunctions'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UpdateWalletPinController {
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
        await request.validate(UpdateWalletPinRequestValidator)
      } catch (ValidationError) {
        await dbTransaction.rollback()
        return response.status(this.unprocessableEntity).send({
          status_code: this.unprocessableEntity,
          status: ERROR,
          message: VALIDATION_ERROR,
          results: ValidationError.messages,
        })
      }
      const { walletPin } = request.body()

      const user = auth.user!

      const wallet = await WalletActions.updateWalletRecord({
        identifierOptions: {
          identifierType: 'userId',
          identifier: user.id,
        },
        updatePayload: {
          pin: await Hash.make(walletPin),
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await dbTransaction.commit()

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: OPERATION_SUCCESSFUL('Update Wallet Pin'),
        results: wallet!.forClient(),
      })
    } catch (UpdateWalletPinControllerError) {
      console.log(
        '🚀 ~ UpdateWalletPinControllerError.handle UpdateWalletPinControllerError ->',
        UpdateWalletPinControllerError
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
