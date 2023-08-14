import UpdateRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/UpdateRecordGeneric'
import WalletIdentifierOptions from 'App/Project/Client/Finance/TypeChecking/Wallet/WalletIdentifierOptions'
import Wallet from 'App/Project/Client/Finance/Models/Wallet'

type UpdateWalletRecordPayload = Partial<Wallet>

type UpdateWalletRecordOptions = UpdateRecordGeneric<
  WalletIdentifierOptions,
  UpdateWalletRecordPayload
>

export default UpdateWalletRecordOptions
