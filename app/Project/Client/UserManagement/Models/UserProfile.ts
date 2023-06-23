import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import AbstractModel from 'App/Common/Models/AbstractBaseModel'

export default class UserProfile extends AbstractModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public customerCode: string

  @column()
  public username: string

  @column()
  public accountLevel: number

  @column()
  public referralCode: string

  @column()
  public gender: string | null

  @column.dateTime({
    serialize: (dateValue: DateTime | null) => {
      return dateValue ? dateValue.setZone('utc').toLocaleString(DateTime.DATETIME_FULL) : dateValue
    },
  })
  public dateOfBirth: DateTime | null

  @column({
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public hasVerifiedBvn: boolean | string

  @column({
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public hasVerifiedNin: boolean | string

  @column({
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public hasUploadedUtilityBill: boolean | string

  @column()
  public countryId: number | null

  @column()
  public stateId: number | null

  @column()
  public cityId: number | null

  @column()
  public streetAddress: string | null

  @column({
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public hasAgreedToTerms: boolean | string

  @column({
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public hasAgreedToStandardSavingsTerms: boolean | string

  @column({
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public hasAgreedToVaultSavingsTerms: boolean | string

  @column({
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public hasAgreedToTargetSavingsTerms: boolean | string

  @column({
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public hasAgreedToDollarSavingsTerms: boolean | string

  @column()
  public profilePictureUrl: string | null
}
