import { NULL_OBJECT } from 'App/Common/Helpers/Messages/SystemMessages'
import CreateWalletRecordOptions from 'App/Project/Client/Finance/TypeChecking/Wallet/CreateWalletRecordOptions'
import Wallet from 'App/Project/Client/Finance/Models/Wallet'
import WalletIdentifierOptions from 'App/Project/Client/Finance/TypeChecking/Wallet/WalletIdentifierOptions'
import UpdateWalletRecordOptions from 'App/Project/Client/Finance/TypeChecking/Wallet/UpdateWalletRecordOptions'
import numberStringGenerator from 'App/Common/Helpers/GeneralPurpose/numberStringGenerator'
import businessConfig from 'Config/businessConfig'

export default class WalletActions {
  private static WALLET_RECORD_NOT_FOUND = NULL_OBJECT

  /**
   * @description Method to create a Wallet record
   * @author CMMA-CLI
   * @static
   * @param {CreateWalletRecordOptions} createWalletRecordOptions
   * @returns {*}  {(Promise<Wallet>)}
   * @memberof WalletActions
   */
  public static async createWalletRecord(
    createWalletRecordOptions: CreateWalletRecordOptions
  ): Promise<Wallet> {
    const { createPayload, dbTransactionOptions } = createWalletRecordOptions

    const wallet = new Wallet()

    await wallet.fill(createPayload)

    if (dbTransactionOptions.useTransaction) {
      wallet.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return wallet.save()
  }

  /**
   * @description Method to get a Wallet record by its primary key
   * @author CMMA-CLI
   * @static
   * @param {number} walletId
   * @returns {*}  {(Promise<Wallet | null>)}
   * @memberof WalletActions
   */
  private static async getWalletRecordById(walletId: number) {
    return Wallet.query().where('id', walletId).first()
  }

  /**
   * @description Method to get a Wallet record by its identifier
   * @author CMMA-CLI
   * @static
   * @param {string} identifier
   * @returns {*}  {(Promise<Wallet | null>)}
   * @memberof WalletActions
   */
  private static async getWalletRecordByIdentifier(identifier: string) {
    return Wallet.query().where('identifier', identifier).first()
  }

  /**
   * @description Method to get a Wallet record by its identifier
   * @author CMMA-CLI
   * @static
   * @param {number} userId
   * @returns {*}  {(Promise<Wallet | null>)}
   * @memberof WalletActions
   */
  private static async getWalletRecordByUserId(userId: number) {
    return Wallet.query().where('userId', userId).first()
  }

  /**
   * @description Method to get a Wallet Record
   * @author CMMA-CLI
   * @static
   * @param { WalletIdentifierOptions} getWalletOptions
   * @returns {*}  {(Promise<Wallet | null>)}
   * @memberof WalletActions
   */
  public static async getWalletRecord(
    getWalletOptions: WalletIdentifierOptions
  ): Promise<Wallet | null> {
    const { identifier, identifierType } = getWalletOptions

    const GetWallet: Record<string, () => Promise<Wallet | null>> = {
      id: async () => await this.getWalletRecordById(Number(identifier)),

      identifier: async () => await this.getWalletRecordByIdentifier(String(identifier)),

      userId: async () => await this.getWalletRecordByUserId(Number(identifier)),
    }

    return await GetWallet[identifierType]()
  }

  /**
   * @description
   * @author CMMA-CLI
   * @static
   * @param {UpdateWalletRecordOptions} updateWalletRecordOptions
   * @returns {*}  {(Promise<Wallet | null>)}
   * @memberof WalletActions
   */
  public static async updateWalletRecord(updateWalletRecordOptions: UpdateWalletRecordOptions) {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateWalletRecordOptions

    const wallet = await this.getWalletRecord(identifierOptions)

    if (wallet === this.WALLET_RECORD_NOT_FOUND) return this.WALLET_RECORD_NOT_FOUND

    await wallet.merge(updatePayload)

    if (dbTransactionOptions.useTransaction) {
      wallet.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return wallet.save()
  }

  /**
   * @description Method to Generate an Account Number
   * @author ƒa†3
   * @returns string
   * @static
   * @memberof WalletActions
   */
  public static generateAccountNumber() {
    const walletPrefix = businessConfig.wallet.accountNumberPrefix

    const accountNumber = numberStringGenerator({
      characterLength: businessConfig.wallet.accountNumberLength,
      outputOption: 'numeric',
    })
    return walletPrefix + accountNumber
  }
}
