import UpdateRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/UpdateRecordGeneric'
import OtpTokenIdentifierOptions from 'App/Project/Client/UserManagement/TypeChecking/OtpToken/OtpTokenIdentifierOptions'
import OtpTokenInterface from 'App/Project/Client/UserManagement/TypeChecking/OtpToken/OtpTokenInterface'

type UpdateOtpTokenRecordPayload = Partial<OtpTokenInterface>

type UpdateOtpTokenRecordOptions = UpdateRecordGeneric<
  OtpTokenIdentifierOptions,
  UpdateOtpTokenRecordPayload
>

export default UpdateOtpTokenRecordOptions
