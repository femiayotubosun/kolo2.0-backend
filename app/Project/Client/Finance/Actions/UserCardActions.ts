import { NULL_OBJECT } from 'App/Common/Helpers/Messages/SystemMessages'
import CreateUserCardRecordOptions from 'App/Project/Client/Finance/TypeChecking/UserCard/CreateUserCardRecordOptions'
import UserCard from 'App/Project/Client/Finance/Models/UserCard'
import UserCardIdentifierOptions from 'App/Project/Client/Finance/TypeChecking/UserCard/UserCardIdentifierOptions'
import UpdateUserCardRecordOptions from 'App/Project/Client/Finance/TypeChecking/UserCard/UpdateUserCardRecordOptions'

export default class UserCardActions {
  private static USER_CARD_RECORD_NOT_FOUND = NULL_OBJECT

  /**
   * @description Method to create a UserCard record
   * @author CMMA-CLI
   * @static
   * @param {CreateUserCardRecordOptions} createUserCardRecordOptions
   * @returns {*}  {(Promise<UserCard>)}
   * @memberof UserCardActions
   */
  public static async createUserCardRecord(
    createUserCardRecordOptions: CreateUserCardRecordOptions
  ): Promise<UserCard> {
    const { createPayload, dbTransactionOptions } = createUserCardRecordOptions

    const userCard = new UserCard()

    await userCard.fill(createPayload)

    if (dbTransactionOptions.useTransaction) {
      userCard.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return userCard.save()
  }

  /**
   * @description Method to get a UserCard record by its primary key
   * @author CMMA-CLI
   * @static
   * @param {number} userCardId
   * @returns {*}  {(Promise<UserCard | null>)}
   * @memberof UserCardActions
   */
  private static async getUserCardRecordById(userCardId: number) {
    return UserCard.query().where('id', userCardId).first()
  }

  /**
   * @description Method to get a UserCard record by its identifier
   * @author CMMA-CLI
   * @static
   * @param {string} identifier
   * @returns {*}  {(Promise<UserCard | null>)}
   * @memberof UserCardActions
   */
  private static async getUserCardRecordByIdentifier(identifier: string) {
    return UserCard.query().where('identifier', identifier).first()
  }

  /**
   * @description Method to get a UserCard Record
   * @author CMMA-CLI
   * @static
   * @param { UserCardIdentifierOptions} getUserCardOptions
   * @returns {*}  {(Promise<UserCard | null>)}
   * @memberof UserCardActions
   */
  public static async getUserCardRecord(
    getUserCardOptions: UserCardIdentifierOptions
  ): Promise<UserCard | null> {
    const { identifier, identifierType } = getUserCardOptions

    const GetUserCard: Record<string, () => Promise<UserCard | null>> = {
      id: async () => await this.getUserCardRecordById(Number(identifier)),

      identifier: async () => await this.getUserCardRecordByIdentifier(String(identifier)),
    }

    return await GetUserCard[identifierType]()
  }

  /**
   * @description
   * @author CMMA-CLI
   * @static
   * @param {UpdateUserCardRecordOptions} updateUserCardRecordOptions
   * @returns {*}  {(Promise<UserCard | null>)}
   * @memberof UserCardActions
   */
  public static async updateUserCardRecord(updateUserCardRecordOptions: UpdateUserCardRecordOptions) {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateUserCardRecordOptions

    const userCard = await this.getUserCardRecord(identifierOptions)

    if (userCard === this.USER_CARD_RECORD_NOT_FOUND) return this.USER_CARD_RECORD_NOT_FOUND

    await userCard.fill(updatePayload)

    if (dbTransactionOptions.useTransaction) {
      userCard.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return userCard.save()
  }
}
