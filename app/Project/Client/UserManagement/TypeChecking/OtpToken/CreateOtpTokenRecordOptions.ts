import OtpTokenInterface from 'App/Project/Client/UserManagement/TypeChecking/OtpToken/OtpTokenInterface'
import CreateNewRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/CreateNewRecordGeneric'

type CreateOtpTokenRecordPayload = Pick<OtpTokenInterface, ''>

type CreateOtpTokenRecordOptions = CreateNewRecordGeneric<CreateOtpTokenRecordPayload>

export default CreateOtpTokenRecordOptions
