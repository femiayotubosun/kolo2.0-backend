import { NULL_OBJECT } from 'App/Common/Helpers/Messages/SystemMessages'
import CreateOtpTokenRecordOptions from 'App/Project/Client/UserManagement/TypeChecking/OtpToken/CreateOtpTokenRecordOptions'
import OtpToken from 'App/Project/Client/UserManagement/Models/OtpToken'
import OtpTokenIdentifierOptions from 'App/Project/Client/UserManagement/TypeChecking/OtpToken/OtpTokenIdentifierOptions'
import UpdateOtpTokenRecordOptions from 'App/Project/Client/UserManagement/TypeChecking/OtpToken/UpdateOtpTokenRecordOptions'
import businessConfig from 'Config/businessConfig'
import { DateTime } from 'luxon'
import GetActiveOtpTokenOptions from 'App/Project/Client/UserManagement/TypeChecking/OtpToken/GetActiveOtpTokenOptions'

export default class OtpTokenActions {
  private static OTP_TOKEN_RECORD_NOT_FOUND = NULL_OBJECT

  /**
   * @description Method to create a OtpToken record
   * @author CMMA-CLI
   * @static
   * @param {CreateOtpTokenRecordOptions} createOtpTokenRecordOptions
   * @returns {*}  {(Promise<OtpToken>)}
   * @memberof OtpTokenActions
   */
  public static async createOtpTokenRecord(
    createOtpTokenRecordOptions: CreateOtpTokenRecordOptions
  ): Promise<OtpToken> {
    const { createPayload, dbTransactionOptions } = createOtpTokenRecordOptions

    const otpToken = new OtpToken()

    Object.assign(otpToken, createPayload)

    if (dbTransactionOptions.useTransaction) {
      otpToken.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return await otpToken.save()
  }

  /**
   * @description Method to fetch active OtpToken
   * @author FATE
   * @static
   * @param {FetchActiveOtpTokenOptions} getActiveOtpTokenOptions
   * @returns {*}  {(Promise<OtpToken | null>)}
   * @memberof OtpTokenActions
   */
  public static async getActiveOtpToken(
    getActiveOtpTokenOptions: GetActiveOtpTokenOptions
  ): Promise<OtpToken | null> {
    const { tokenType, email } = getActiveOtpTokenOptions
    const isRevoked = false

    const otpTokenInfo = await OtpToken.query()
      .where('email', String(email))
      .where('is_revoked', isRevoked)
      .where('token_type', String(tokenType))
      .first()

    return otpTokenInfo || OtpTokenActions.OTP_TOKEN_RECORD_NOT_FOUND
  }

  /**
   * @description Method to get a OtpToken record by its primary key
   * @author CMMA-CLI
   * @static
   * @param {number} otpTokenId
   * @returns {*}  {(Promise<OtpToken | null>)}
   * @memberof OtpTokenActions
   */
  private static async getOtpTokenRecordById(otpTokenId: number) {
    const otpToken = await OtpToken.query().where('id', otpTokenId).first()

    return otpToken || this.OTP_TOKEN_RECORD_NOT_FOUND
  }

  /**
   * @description Method to get a OtpToken record by its identifier
   * @author CMMA-CLI
   * @static
   * @param {string} identifier
   * @returns {*}  {(Promise<OtpToken | null>)}
   * @memberof OtpTokenActions
   */
  private static async getOtpTokenRecordByIdentifier(identifier: string) {
    const otpToken = await OtpToken.query().where('identifier', identifier).first()

    return otpToken || this.OTP_TOKEN_RECORD_NOT_FOUND
  }

  /**
   * @description Method to get a OtpToken Record
   * @author CMMA-CLI
   * @static
   * @param { OtpTokenIdentifierOptions} getOtpTokenOptions
   * @returns {*}  {(Promise<OtpToken | null>)}
   * @memberof OtpTokenActions
   */
  public static async getOtpTokenRecord(
    getOtpTokenOptions: OtpTokenIdentifierOptions
  ): Promise<OtpToken | null> {
    const { identifier, identifierType } = getOtpTokenOptions

    const GetOtpToken: Record<string, Function> = {
      id: async () => await this.getOtpTokenRecordById(Number(identifier)),

      identifier: async () => await this.getOtpTokenRecordByIdentifier(String(identifier)),
    }

    return await GetOtpToken[identifierType]()
  }

  /**
   * @description
   * @author CMMA-CLI
   * @static
   * @param {UpdateOtpTokenRecordOptions} updateOtpTokenRecordOptions
   * @returns {*}  {(Promise<OtpToken | null>)}
   * @memberof OtpTokenActions
   */
  public static async updateOtpTokenRecord(
    updateOtpTokenRecordOptions: UpdateOtpTokenRecordOptions
  ) {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateOtpTokenRecordOptions

    const otpToken = await this.getOtpTokenRecord(identifierOptions)

    if (otpToken === this.OTP_TOKEN_RECORD_NOT_FOUND) return

    Object.assign(otpToken, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      otpToken.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return await otpToken.save()
  }

  /**
   * @description Method Revoke an existing OTP Token found in the DB
   * @author FATE
   * @param {number} tokenId The Primary Key Identifier of the OTP Token DB record
   * @returns {*} {(Promise<OtpToken | null>)} The Revoked OTP Token Record or null
   * @memberof OtpTokenActions
   */
  public static async revokeExistingOtpToken(tokenId: number): Promise<OtpToken | null> {
    const otpRecord = await OtpTokenActions.getOtpTokenRecordById(tokenId)
    const TOKEN_IS_NOW_INVALID = true

    if (!otpRecord) {
      return OtpTokenActions.OTP_TOKEN_RECORD_NOT_FOUND
    }

    otpRecord.isRevoked = TOKEN_IS_NOW_INVALID
    await otpRecord.save()

    return otpRecord
  }

  /**
   * @description A method that generates a DateTime object used to set the expiration time of the otpToken.
   * @author FATE
   * @returns {*} {DateTime}
   * @memberof OtpTokenActions
   */
  public static async generateOtpTokenExpirationTime(): Promise<DateTime> {
    return businessConfig.currentDateTime().plus({
      minute: businessConfig.otpToken.expirationTimeFrame,
    })
  }
}
