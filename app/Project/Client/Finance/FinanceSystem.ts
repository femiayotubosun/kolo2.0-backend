import CreateWalletRecordOptions from 'App/Project/Client/Finance/TypeChecking/Wallet/CreateWalletRecordOptions'
import WalletActions from 'App/Project/Client/Finance/Actions/WalletActions'

export default class FinanceSystem {
  /**
   * @description Method to Create a wallet Record
   * @author ƒa†3
   * @param {CreateWalletRecordOptions} createWalletRecordOptions
   * @static
   * @memberof FinanceSystem
   */
  public static async createWalletRecord(createWalletRecordOptions: CreateWalletRecordOptions) {
    return WalletActions.createWalletRecord(createWalletRecordOptions)
  }

  /**
   * @description Method to generate a wallet account number
   * @author ƒa†3
   * @static
   * @memberof generateWalletAccountNumber
   */
  public static generateWalletAccountNumber() {
    return WalletActions.generateAccountNumber()
  }
}
