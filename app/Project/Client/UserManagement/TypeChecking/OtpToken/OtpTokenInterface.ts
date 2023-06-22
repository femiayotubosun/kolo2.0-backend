import { DateTime } from 'luxon'

export default interface OtpTokenInterface {
  id: number

  identifier: string

  tokenType: 'email-verification' | 'change-password' | 'reset-password'

  token: string

  email: string

  isRevoked: boolean

  expiresAt: DateTime

  createdAt: DateTime

  updatedAt: DateTime
}
