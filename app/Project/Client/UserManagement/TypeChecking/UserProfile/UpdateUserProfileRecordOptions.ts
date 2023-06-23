import UpdateRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/UpdateRecordGeneric'
import UserProfileIdentifierOptions from 'App/Project/Client/UserManagement/TypeChecking/UserProfile/UserProfileIdentifierOptions'
import UserProfileInterface from 'App/Project/Client/UserManagement/TypeChecking/UserProfile/UserProfileInterface'

type UpdateUserProfileRecordPayload = Partial<UserProfileInterface>

type UpdateUserProfileRecordOptions = UpdateRecordGeneric<
  UserProfileIdentifierOptions,
  UpdateUserProfileRecordPayload
>

export default UpdateUserProfileRecordOptions
