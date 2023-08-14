import CreateNewRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/CreateNewRecordGeneric'
import Wallet from 'App/Project/Client/Finance/Models/Wallet'

type CreateWalletRecordPayload = Pick<Wallet, 'userId' | 'accountNumber' | 'balance'>

type CreateWalletRecordOptions = CreateNewRecordGeneric<CreateWalletRecordPayload>

export default CreateWalletRecordOptions
