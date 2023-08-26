import InitializeTransactionOptions from 'App/InfrastructureProviders/TypeChecking/PaymentProvider/InitializeTransactionOptions'
import CreateCustomerReturnType from 'App/InfrastructureProviders/TypeChecking/PaymentProvider/CreateCustomerReturnType'
import VerifyTransactionResponseType from 'App/InfrastructureProviders/TypeChecking/PaymentProvider/VerifyTransactionReturnType'
import ChargeAuthorizationOptions from 'App/InfrastructureProviders/TypeChecking/PaymentProvider/ChargeAuthorizationOptions'
import ChargeAuthorizationResponseType from 'App/InfrastructureProviders/TypeChecking/PaymentProvider/ChargeAuthorizationReturnType'

interface PaymentProviderDriverInterface {
  createCustomer(createCustomerOptions: CreateCustomerOptions): Promise<CreateCustomerReturnType>

  initializeTransaction(initializeTransactionOptions: InitializeTransactionOptions): Promise<any>

  verifyTransaction(
    verifyTransactionOptions: VerifyTransactionOptions
  ): Promise<VerifyTransactionResponseType>

  chargeAuthorization(
    chargeAuthorizationOptions: ChargeAuthorizationOptions
  ): Promise<ChargeAuthorizationResponseType>

  whoIsTheCurrentProvider(): string
}

export default PaymentProviderDriverInterface
