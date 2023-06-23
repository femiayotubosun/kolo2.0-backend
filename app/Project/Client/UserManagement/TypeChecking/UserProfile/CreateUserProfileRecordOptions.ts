import UserProfileInterface from 'App/Project/Client/UserManagement/TypeChecking/UserProfile/UserProfileInterface'
import CreateNewRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/CreateNewRecordGeneric'

type CreateUserProfileRecordPayload = Pick<
  UserProfileInterface,
  'userId' | 'username' | 'customerCode' | 'referralCode'
>

type CreateUserProfileRecordOptions = CreateNewRecordGeneric<CreateUserProfileRecordPayload>

export default CreateUserProfileRecordOptions
