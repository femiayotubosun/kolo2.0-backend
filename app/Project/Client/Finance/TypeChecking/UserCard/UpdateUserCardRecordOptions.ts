import UpdateRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/UpdateRecordGeneric'
import UserCardIdentifierOptions from 'App/Project/Client/Finance/TypeChecking/UserCard/UserCardIdentifierOptions'
import UserCardInterface from 'App/Project/Client/Finance/TypeChecking/UserCard/UserCardInterface'

type UpdateUserCardRecordPayload = Partial<UserCardInterface>

type UpdateUserCardRecordOptions = UpdateRecordGeneric<
  UserCardIdentifierOptions,
  UpdateUserCardRecordPayload
>

export default UpdateUserCardRecordOptions


