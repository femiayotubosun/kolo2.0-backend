import UpdateRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/UpdateRecordGeneric'
import UserIdentifierOptions from 'App/Project/Client/UserManagement/TypeChecking/User/UserIdentifierOptions'
import UserInterface from 'App/Project/Client/UserManagement/TypeChecking/User/UserInterface'

type UpdateUserRecordPayload = Partial<UserInterface>

type UpdateUserRecordOptions = UpdateRecordGeneric<UserIdentifierOptions, UpdateUserRecordPayload>

export default UpdateUserRecordOptions
