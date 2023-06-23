import UserInterface from 'App/Project/Client/UserManagement/TypeChecking/User/UserInterface'
import CreateNewRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/CreateNewRecordGeneric'

type CreateUserRecordPayload = Pick<
  UserInterface,
  'email' | 'firstName' | 'lastName' | 'password' | 'mobileNumber' | 'lastLoginDate'
>

type CreateUserRecordOptions = CreateNewRecordGeneric<CreateUserRecordPayload>

export default CreateUserRecordOptions
