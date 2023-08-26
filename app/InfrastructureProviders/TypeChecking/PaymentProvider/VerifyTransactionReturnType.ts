import { DateTime } from 'luxon'

type VerifyTransactionResponseType =
  | {
      transactionStatus: 'success'

      infrastructureResults: Record<string, unknown>

      transactionVerificationInformation: {
        transactionReference: string

        amount: number

        transactionDate: DateTime
      }

      cardInformation: {
        authorizationCode: string

        lastFourDigits: string

        cardExpirationDate: string

        cardType: string

        isReusable: boolean
      }

      paystackCustomerCode: string
    }
  | {
      transactionStatus: 'pending' | 'failed'

      infrastructureResults: Record<string, unknown>

      transactionVerificationInformation: {
        transactionReference: string

        amount: number

        transactionDate: DateTime
      }
      cardInformation: null

      paystackCustomerCode: string
    }
  | {
      transactionStatus: 'request-failed'

      infrastructureResults: null

      transactionVerificationInformation: null

      cardInformation: null

      paystackCustomerCode: null
    }

export default VerifyTransactionResponseType
