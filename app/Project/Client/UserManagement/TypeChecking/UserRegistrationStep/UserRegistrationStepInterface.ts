import { DateTime } from 'luxon'

export default interface UserRegistrationStepInterface {
  id: number

  identifier: string

  userId: number

  hasVerifiedAccount: boolean

  hasSecuredAccount: boolean

  hasUpgradedAccount: boolean

  createAt: DateTime

  updatedAt: DateTime
}
