import UserCardInterface from 'App/Project/Client/Finance/TypeChecking/UserCard/UserCardInterface'
import CreateNewRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/CreateNewRecordGeneric'


type CreateUserCardRecordPayload = Pick<UserCardInterface, ''>

type CreateUserCardRecordOptions = CreateNewRecordGeneric<CreateUserCardRecordPayload>

export default CreateUserCardRecordOptions
