import { DateTime } from 'luxon'

export default interface UserProfileInterface {
  id: number

  identifier: string

  userId: number

  customerCode: string

  username: string

  accountLevel: number

  referralCode: string

  gender: string | null

  dateOfBirth: DateTime | null

  hasVerifiedBvn: boolean | string

  hasVerifiedNin: boolean | string

  hasUploadedUtilityBill: boolean | string

  countryId: number | null

  stateId: number | null

  cityId: number | null

  streetAddress: string | null

  hasAgreedToTerms: boolean | string

  hasAgreedToStandardSavingsTerms: boolean | string

  hasAgreedToVaultSavingsTerms: boolean | string

  hasAgreedToDollarSavingsTerms: boolean | string

  hasAgreedToTargetSavingsTerms: boolean | string

  profilePictureUrl: string | null

  createdAt: DateTime

  updatedAt: DateTime
}
