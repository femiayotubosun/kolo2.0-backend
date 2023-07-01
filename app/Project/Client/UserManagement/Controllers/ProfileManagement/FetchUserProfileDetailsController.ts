import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  ERROR,
  SUCCESS,
  SOMETHING_WENT_WRONG,
  USER_PROFILE,
} from 'App/Common/Helpers/Messages/SystemMessages'
import UserProfileActions from 'App/Project/Client/UserManagement/Actions/UserProfileActions'
import UserRegistrationStepActions from 'App/Project/Client/UserManagement/Actions/UserRegistrationStepActions'
import { RESOURCE_FETCHED_SUCCESSFULLY } from 'App/Common/Helpers/Messages/SystemMessageFunctions'

export default class FetchUserProfileDetailsController {
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

      const userProfile = (await UserProfileActions.getUserProfileRecord({
        identifier: user.id,
        identifierType: 'userId',
      }))!

      const userRegistrationSteps =
        (await UserRegistrationStepActions.getUserRegistrationStepRecord({
          identifier: user.id,
          identifierType: 'userId',
        }))!

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: RESOURCE_FETCHED_SUCCESSFULLY(USER_PROFILE),
        results: {
          ...user.forClient,
          ...userProfile.forClient,
          userRegistrationSteps: { ...userRegistrationSteps.forClient },
        },
      })
    } catch (FetchUserProfileDetailControllerError) {
      console.log(
        '🚀 ~ FetchUserProfileDetailControllerError.handle FetchUserProfileDetailControllerError ->',
        FetchUserProfileDetailControllerError
      )

      return response.status(this.internalServerError).send({
        status_code: this.internalServerError,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
