import { NULL_OBJECT } from 'App/Common/Helpers/Messages/SystemMessages'
import CreateUserRecordOptions from 'App/Project/Client/UserManagement/TypeChecking/User/CreateUserRecordOptions'
import User from 'App/Project/Client/UserManagement/Models/User'
import UserIdentifierOptions from 'App/Project/Client/UserManagement/TypeChecking/User/UserIdentifierOptions'
import UpdateUserRecordOptions from 'App/Project/Client/UserManagement/TypeChecking/User/UpdateUserRecordOptions'

export default class UserActions {
  private static USER_RECORD_NOT_FOUND = NULL_OBJECT

  /**
   * @description Method to create a User record
   * @author CMMA-CLI
   * @static
   * @param {CreateUserRecordOptions} createUserRecordOptions
   * @returns {*}  {(Promise<User>)}
   * @memberof UserActions
   */
  public static async createUserRecord(
    createUserRecordOptions: CreateUserRecordOptions
  ): Promise<User> {
    const { createPayload, dbTransactionOptions } = createUserRecordOptions

    const user = new User()

    Object.assign(user, createPayload)

    if (dbTransactionOptions.useTransaction) {
      user.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return user.save()
  }

  /**
   * @description Method to get a User record by its primary key
   * @author CMMA-CLI
   * @static
   * @param {number} userId
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserActions
   */
  private static async getUserRecordById(userId: number) {
    return User.query().where('id', userId).first()
  }

  /**
   * @description Method to get a User record by its identifier
   * @author CMMA-CLI
   * @static
   * @param {string} identifier
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserActions
   */
  private static async getUserRecordByIdentifier(identifier: string) {
    return User.query().where('identifier', identifier).first()
  }

  /**
   * @description Method to get a User record by email
   * @author FATE
   * @param {string} email
   * @static
   * @memberof getUserRecordByEmail
   */
  public static async getUserRecordByEmail(email: string) {
    return User.query().where('email', email).first()
  }

  /**
   * @description Method to get a User Record
   * @author CMMA-CLI
   * @static
   * @param { UserIdentifierOptions} getUserOptions
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserActions
   */
  public static async getUserRecord(getUserOptions: UserIdentifierOptions): Promise<User | null> {
    const { identifier, identifierType } = getUserOptions

    const GetUser: Record<string, () => Promise<User | null>> = {
      id: async () => await this.getUserRecordById(Number(identifier)),

      identifier: async () => await this.getUserRecordByIdentifier(String(identifier)),

      email: async () => await this.getUserRecordByEmail(String(identifier)),
    }

    return GetUser[identifierType]()
  }

  /**
   * @description
   * @author CMMA-CLI
   * @static
   * @param {UpdateUserRecordOptions} updateUserRecordOptions
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserActions
   */
  public static async updateUserRecord(updateUserRecordOptions: UpdateUserRecordOptions) {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateUserRecordOptions

    const user = await this.getUserRecord(identifierOptions)

    if (user === this.USER_RECORD_NOT_FOUND) return this.USER_RECORD_NOT_FOUND

    Object.assign(user, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      user.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return user.save()
  }
}
