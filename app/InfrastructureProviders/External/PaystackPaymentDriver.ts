import PaymentProviderDriverInterface from 'App/InfrastructureProviders/TypeChecking/PaymentProvider/PaymentProviderDriverInterface'
import InitializeTransactionOptions from 'App/InfrastructureProviders/TypeChecking/PaymentProvider/InitializeTransactionOptions'
import paystackConfig from 'Config/paystackConfig'
import HttpClient from 'App/InfrastructureProviders/Internal/HttpClient'
import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { NULL_OBJECT } from 'App/Common/Helpers/Messages/SystemMessages'
import { DateTime } from 'luxon'
import businessConfig from 'Config/businessConfig'

export default class PaystackPaymentDriver implements PaymentProviderDriverInterface {
  #serviceIdentifier = paystackConfig.identifier

  #secretKey = paystackConfig.secretKey

  public async chargeAuthorization(): Promise<any> {}

  public async initializeTransaction(
    initializeTransactionOptions: InitializeTransactionOptions
  ): Promise<any> {
    const {} = initializeTransactionOptions
  }

  public async verifyTransaction(verifyTransactionOptions: VerifyTransactionOptions): Promise<any> {
    const { transactionReference, amount } = verifyTransactionOptions

    const verifyTransactionEndpoint = new URL(paystackConfig.verifyTransactionEndpoint)

    verifyTransactionEndpoint.pathname += `/${transactionReference}`

    const httpClientResponse = await HttpClient.get({
      endpointUrl: verifyTransactionEndpoint.toString(),
      headerOptions: {
        headers: {
          Authorization: `Bearer ${this.#secretKey}`,
        },
      },
    })

    if (httpClientResponse.statusCode !== HttpStatusCodeEnum.OK) {
      console.log(
        '🚀 ~ PaystackPaymentDriver.verifyTransaction PaystackPaymentDriverError ->',
        httpClientResponse.apiResponse
      )
      return {
        transactionStatus: 'request-failed',
        infrastructureResults: NULL_OBJECT,
        transactionVerificationInformation: NULL_OBJECT,
        cardInformation: NULL_OBJECT,
        paystackCustomerCode: NULL_OBJECT,
      }
    }

    const transactionStatus = httpClientResponse.apiResponse.data.status

    if (transactionStatus === 'abandoned') {
      console.log(
        '🚀 ~ PaystackPaymentDriver.verifyTransaction PaystackPaymentDriverError ->',
        httpClientResponse.apiResponse
      )
      return {
        transactionStatus: 'pending',
        infrastructureResults: httpClientResponse.apiResponse.data,
        transactionVerificationInformation: {
          transactionReference: httpClientResponse.apiResponse.data.reference,
          amount: httpClientResponse.apiResponse.data.amount,
          transactionDate:
            DateTime.fromISO(httpClientResponse.apiResponse.data.transaction_date) ||
            businessConfig.currentDateTime(),
        },
        cardInformation: NULL_OBJECT,
        paystackCustomerCode: httpClientResponse.apiResponse.data.customer.customer_code,
      }
    }

    if (transactionStatus === 'failed') {
      console.log(
        '🚀 ~ PaystackPaymentDriver.verifyTransaction PaystackPaymentDriverError ->',
        httpClientResponse.apiResponse
      )
      return {
        transactionStatus: 'failed',
        infrastructureResults: httpClientResponse.apiResponse.data,
        transactionVerificationInformation: {
          transactionReference: httpClientResponse.apiResponse.data.reference,
          amount: httpClientResponse.apiResponse.data.amount,
          transactionDate:
            DateTime.fromISO(httpClientResponse.apiResponse.data.transaction_date) ||
            businessConfig.currentDateTime(),
        },
        cardInformation: NULL_OBJECT,
        paystackCustomerCode: httpClientResponse.apiResponse.data.customer.customer_code,
      }
    }

    if (amount.toString() !== httpClientResponse.apiResponse.data.amount.toString()) {
      console.log(
        '🚀 ~ PaystackPaymentDriver.verifyTransaction PaystackPaymentDriverError -> Amount Mismatch'
      )
      return {
        transactionStatus: 'failed',
        infrastructureResults: httpClientResponse.apiResponse.data,
        transactionVerificationInformation: {
          transactionReference: httpClientResponse.apiResponse.data.reference,
          amount: httpClientResponse.apiResponse.data.amount,
          transactionDate:
            DateTime.fromISO(httpClientResponse.apiResponse.data.transaction_date) ||
            businessConfig.currentDateTime(),
        },
        cardInformation: NULL_OBJECT,
        paystackCustomerCode: httpClientResponse.apiResponse.data.customer.customer_code,
      }
    }

    return {
      transactionStatus: 'success',
      infrastructureResults: httpClientResponse.apiResponse.data,
      transactionVerificationInformation: {
        transactionReference: httpClientResponse.apiResponse.data.reference,
        amount: httpClientResponse.apiResponse.data.amount,
        transactionDate: DateTime.fromISO(httpClientResponse.apiResponse.data.transaction_date),
      },
      cardInformation: {
        authorizationCode: httpClientResponse.apiResponse.data.authorization.authorization_code,
        lastFourDigits: httpClientResponse.apiResponse.data.authorization.last4,
        cardExpirationDate:
          httpClientResponse.apiResponse.data.authorization.exp_month +
          '/' +
          httpClientResponse.apiResponse.data.authorization.exp_year.substring(2),
        cardType: httpClientResponse.apiResponse.data.authorization.card_type.trim(),
        isReusable: httpClientResponse.apiResponse.data.authorization.reusable,
      },
      paystackCustomerCode: httpClientResponse.apiResponse.data.customer.customer_code,
    }
  }

  public async createCustomer(createCustomerOptions: CreateCustomerOptions): Promise<any> {
    const { firstName, lastName, email } = createCustomerOptions

    const httpClientResponse = await HttpClient.post({
      endpointUrl: paystackConfig.createCustomerEndpoint,
      headerOptions: {
        headers: {
          Authorization: `Bearer ${this.#secretKey}`,
        },
      },
      dataPayload: {
        email,
        first_name: firstName,
        last_name: lastName,
      },
    })

    if (httpClientResponse.statusCode !== HttpStatusCodeEnum.OK) {
      console.log(
        '🚀 ~ PaystackPaymentDriver.createCustomer PaystackPaymentDriverError ->',
        httpClientResponse.apiResponse
      )
      return {
        infrastructureResults: NULL_OBJECT,
        customerInformation: NULL_OBJECT,
      }
    }

    return {
      infrastructureResults: httpClientResponse.apiResponse.data,
      customerInformation: {
        customerCode: httpClientResponse.apiResponse.data.customer_code,
      },
    }
  }

  public whoIsTheCurrentProvider(): string {
    return this.#serviceIdentifier
  }
}
