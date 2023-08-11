import { NULL_OBJECT } from 'App/Common/Helpers/Messages/SystemMessages'
import CreateUserProfileRecordOptions from 'App/Project/Client/UserManagement/TypeChecking/UserProfile/CreateUserProfileRecordOptions'
import UserProfile from 'App/Project/Client/UserManagement/Models/UserProfile'
import UserProfileIdentifierOptions from 'App/Project/Client/UserManagement/TypeChecking/UserProfile/UserProfileIdentifierOptions'
import UpdateUserProfileRecordOptions from 'App/Project/Client/UserManagement/TypeChecking/UserProfile/UpdateUserProfileRecordOptions'
import numberStringGenerator from 'App/Common/Helpers/GeneralPurpose/numberStringGenerator'
import businessConfig from 'Config/businessConfig'

export default class UserProfileActions {
  private static USER_PROFILE_RECORD_NOT_FOUND = NULL_OBJECT

  /**
   * @description Method to create a UserProfile record
   * @author CMMA-CLI
   * @static
   * @param {CreateUserProfileRecordOptions} createUserProfileRecordOptions
   * @returns {*}  {(Promise<UserProfile>)}
   * @memberof UserProfileActions
   */
  public static async createUserProfileRecord(
    createUserProfileRecordOptions: CreateUserProfileRecordOptions
  ): Promise<UserProfile> {
    const { createPayload, dbTransactionOptions } = createUserProfileRecordOptions

    const userProfile = new UserProfile()

    Object.assign(userProfile, createPayload)

    if (dbTransactionOptions.useTransaction) {
      userProfile.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return await userProfile.save()
  }

  /**
   * @description Method to get a UserProfile record by its primary key
   * @author CMMA-CLI
   * @static
   * @param {number} userProfileId
   * @returns {*}  {(Promise<UserProfile | null>)}
   * @memberof UserProfileActions
   */
  private static async getUserProfileRecordById(userProfileId: number) {
    return UserProfile.query().where('id', userProfileId).first()
  }

  /**
   * @description Method to get a UserProfile record by its identifier
   * @author CMMA-CLI
   * @static
   * @param {string} identifier
   * @returns {*}  {(Promise<UserProfile | null>)}
   * @memberof UserProfileActions
   */
  private static async getUserProfileRecordByIdentifier(identifier: string) {
    return UserProfile.query().where('identifier', identifier).first()
  }

  /**
   * @description Method to get UserProfile record by userId
   * @author FATE
   * @param {number} userId
   * @static
   * @memberof UserProfileActions
   */
  public static async getUserProfileRecordByUserId(userId: number) {
    return UserProfile.query().where('userId', userId).first()
  }

  /**
   * @description Method to get UserProfile record by customerCode
   * @author FATE
   * @param {string} customerCode
   * @static
   * @memberof UserProfileActions
   */
  public static async getUserProfileRecordByCustomerCode(customerCode: string) {
    return UserProfile.query().where('customerCode', customerCode).first()
  }

  /**
   * @description Method to get UserProfile record by referralCode
   * @author FATE
   * @param {string} referralCode
   * @static
   * @memberof UserProfileActions
   */
  public static async getUserProfileRecordByReferralCode(referralCode: string) {
    return UserProfile.query().where('referralCode', referralCode).first()
  }

  /**
   * @description Method to get UserProfile record by username
   * @author FATE
   * @param {string} username
   * @static
   * @memberof UserProfileActions
   */
  public static async getUserProfileRecordByUsername(username: string) {
    return UserProfile.query().where('username', username).first()
  }

  /**
   * @description Method to get a UserProfile Record
   * @author CMMA-CLI
   * @static
   * @param { UserProfileIdentifierOptions} getUserProfileOptions
   * @returns {*}  {(Promise<UserProfile | null>)}
   * @memberof UserProfileActions
   */
  public static async getUserProfileRecord(
    getUserProfileOptions: UserProfileIdentifierOptions
  ): Promise<UserProfile | null> {
    const { identifier, identifierType } = getUserProfileOptions

    const GetUserProfile: Record<string, () => Promise<UserProfile | null>> = {
      id: async () => await this.getUserProfileRecordById(Number(identifier)),

      identifier: async () => await this.getUserProfileRecordByIdentifier(String(identifier)),

      userId: async () => await this.getUserProfileRecordByUserId(Number(identifier)),

      customerCode: async () => await this.getUserProfileRecordByCustomerCode(String(identifier)),

      referralCode: async () => await this.getUserProfileRecordByReferralCode(String(identifier)),

      username: async () => await this.getUserProfileRecordByUsername(String(identifier)),
    }

    return await GetUserProfile[identifierType]()
  }

  /**
   * @description
   * @author CMMA-CLI
   * @static
   * @param {UpdateUserProfileRecordOptions} updateUserProfileRecordOptions
   * @returns {*}  {(Promise<UserProfile | null>)}
   * @memberof UserProfileActions
   */
  public static async updateUserProfileRecord(
    updateUserProfileRecordOptions: UpdateUserProfileRecordOptions
  ) {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateUserProfileRecordOptions

    const userProfile = await this.getUserProfileRecord(identifierOptions)

    if (userProfile === this.USER_PROFILE_RECORD_NOT_FOUND)
      return this.USER_PROFILE_RECORD_NOT_FOUND

    Object.assign(userProfile, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      userProfile.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return userProfile.save()
  }

  /**
   * @description Method to generate a referral code
   * @author FATE
   * @static
   * @returns {string}
   * @memberof UserProfileActions
   */
  public static generateReferralCode() {
    return numberStringGenerator({
      characterLength: businessConfig.userProfile.referralCodeLength,
      outputOption: 'alphanumeric',
      isCapitalized: false,
    })
  }

  /**
   * @description Method to generate a customer code
   * @author FATE
   * @static
   * @returns {string}
   * @memberof UserProfileActions
   */
  public static generateCustomerCode() {
    const customerCodePrefix = businessConfig.userProfile.customerCodePrefix

    const customerCode = numberStringGenerator({
      characterLength: businessConfig.userProfile.customerCodeLength,
      outputOption: 'alphanumeric',
      isCapitalized: true,
    })

    return `${customerCodePrefix}${customerCode}`
  }
}
