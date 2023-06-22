import OtpTokenInterface from 'App/Project/Client/UserManagement/TypeChecking/OtpToken/OtpTokenInterface'

type FetchActiveOtpTokenOptions = Pick<OtpTokenInterface, 'tokenType' | 'email'>

export default FetchActiveOtpTokenOptions
