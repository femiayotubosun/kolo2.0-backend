import { NULL_OBJECT } from 'App/Common/Helpers/Messages/SystemMessages'
import CreateUserRegistrationStepRecordOptions from 'App/Project/Client/UserManagement/TypeChecking/UserRegistrationStep/CreateUserRegistrationStepRecordOptions'
import UserRegistrationStep from 'App/Project/Client/UserManagement/Models/UserRegistrationStep'
import UserRegistrationStepIdentifierOptions from 'App/Project/Client/UserManagement/TypeChecking/UserRegistrationStep/UserRegistrationStepIdentifierOptions'
import UpdateUserRegistrationStepRecordOptions from 'App/Project/Client/UserManagement/TypeChecking/UserRegistrationStep/UpdateUserRegistrationStepRecordOptions'

export default class UserRegistrationStepActions {
  private static USER_REGISTRATION_STEP_RECORD_NOT_FOUND = NULL_OBJECT

  /**
   * @description Method to create a UserRegistrationStep record
   * @author CMMA-CLI
   * @static
   * @param {CreateUserRegistrationStepRecordOptions} createUserRegistrationStepRecordOptions
   * @returns {*}  {(Promise<UserRegistrationStep>)}
   * @memberof UserRegistrationStepActions
   */
  public static async createUserRegistrationStepRecord(
    createUserRegistrationStepRecordOptions: CreateUserRegistrationStepRecordOptions
  ): Promise<UserRegistrationStep> {
    const { createPayload, dbTransactionOptions } = createUserRegistrationStepRecordOptions

    const userRegistrationStep = new UserRegistrationStep()

    Object.assign(userRegistrationStep, createPayload)

    if (dbTransactionOptions.useTransaction) {
      userRegistrationStep.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return await userRegistrationStep.save()
  }

  /**
   * @description Method to get a UserRegistrationStep record by its primary key
   * @author CMMA-CLI
   * @static
   * @param {number} userRegistrationStepId
   * @returns {*}  {(Promise<UserRegistrationStep | null>)}
   * @memberof UserRegistrationStepActions
   */
  private static async getUserRegistrationStepRecordById(userRegistrationStepId: number) {
    return UserRegistrationStep.query().where('id', userRegistrationStepId).first()
  }

  /**
   * @description Method to get a UserRegistrationStep record by its identifier
   * @author CMMA-CLI
   * @static
   * @param {string} identifier
   * @returns {*}  {(Promise<UserRegistrationStep | null>)}
   * @memberof UserRegistrationStepActions
   */
  private static async getUserRegistrationStepRecordByIdentifier(identifier: string) {
    return UserRegistrationStep.query().where('identifier', identifier).first()
  }

  /**
   * @description Method to get a UserRegistrationStep record by its userId
   * @author CMMA-CLI
   * @static
   * @param {number} userId
   * @returns {*}  {(Promise<UserRegistrationStep | null>)}
   * @memberof UserRegistrationStepActions
   */
  private static async getUserRegistrationStepRecordByUserId(userId: number) {
    return UserRegistrationStep.query().where('userId', userId).first()
  }

  /**
   * @description Method to get a UserRegistrationStep Record
   * @author CMMA-CLI
   * @static
   * @param { UserRegistrationStepIdentifierOptions} getUserRegistrationStepOptions
   * @returns {*}  {(Promise<UserRegistrationStep | null>)}
   * @memberof UserRegistrationStepActions
   */
  public static async getUserRegistrationStepRecord(
    getUserRegistrationStepOptions: UserRegistrationStepIdentifierOptions
  ): Promise<UserRegistrationStep | null> {
    const { identifier, identifierType } = getUserRegistrationStepOptions

    const GetUserRegistrationStep: Record<string, () => Promise<UserRegistrationStep | null>> = {
      id: async () => await this.getUserRegistrationStepRecordById(Number(identifier)),

      identifier: async () =>
        await this.getUserRegistrationStepRecordByIdentifier(String(identifier)),

      userId: async () => await this.getUserRegistrationStepRecordByUserId(Number(identifier)),
    }

    return await GetUserRegistrationStep[identifierType]()
  }

  /**
   * @description
   * @author CMMA-CLI
   * @static
   * @param {UpdateUserRegistrationStepRecordOptions} updateUserRegistrationStepRecordOptions
   * @returns {*}  {(Promise<UserRegistrationStep | null>)}
   * @memberof UserRegistrationStepActions
   */
  public static async updateUserRegistrationStepRecord(
    updateUserRegistrationStepRecordOptions: UpdateUserRegistrationStepRecordOptions
  ) {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateUserRegistrationStepRecordOptions

    const userRegistrationStep = await this.getUserRegistrationStepRecord(identifierOptions)

    if (userRegistrationStep === this.USER_REGISTRATION_STEP_RECORD_NOT_FOUND)
      return this.USER_REGISTRATION_STEP_RECORD_NOT_FOUND

    Object.assign(userRegistrationStep, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      userRegistrationStep.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return userRegistrationStep.save()
  }
}
