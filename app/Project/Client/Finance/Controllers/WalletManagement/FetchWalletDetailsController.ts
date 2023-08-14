import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ERROR, SUCCESS, SOMETHING_WENT_WRONG } from 'App/Common/Helpers/Messages/SystemMessages'
import WalletActions from 'App/Project/Client/Finance/Actions/WalletActions'
import { RESOURCE_FETCHED_SUCCESSFULLY } from 'App/Common/Helpers/Messages/SystemMessageFunctions'

export default class FetchWalletDetailsController {
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

      const wallet = await WalletActions.getWalletRecord({
        identifier: user.id,
        identifierType: 'userId',
      })

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: RESOURCE_FETCHED_SUCCESSFULLY('Wallet'),
        results: wallet!.forClient(),
      })
    } catch (FetchWalletDetailControllerError) {
      console.log(
        '🚀 ~ FetchWalletDetailControllerError.handle FetchWalletDetailControllerError ->',
        FetchWalletDetailControllerError
      )

      return response.status(this.internalServerError).send({
        status_code: this.internalServerError,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
