import { DateTime } from 'luxon'

type ChargeAuthorizationResponseType =
  | {
      transactionStatus: 'success'

      infrastructureResults: Record<string, unknown>

      transactionVerificationInformation: {
        transactionReference: string

        amount: number

        transactionDate: DateTime
      }
    }
  | {
      transactionStatus: 'pending' | 'failed'

      infrastructureResults: Record<string, unknown>

      transactionVerificationInformation: {
        transactionReference: string

        amount: number

        transactionDate: DateTime
      }
    }
  | {
      transactionStatus: 'request-failed'

      infrastructureResults: null

      transactionVerificationInformation: null
    }

export default ChargeAuthorizationResponseType
