import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import AbstractModel from 'App/Common/Models/AbstractBaseModel'
import { NOT_APPLICABLE } from 'App/Common/Helpers/Messages/SystemMessages'

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

  @column()
  public profilePictureUrl: string | null

  public get forClient() {
    return {
      customerCode: this.customerCode ?? NOT_APPLICABLE,
      username: this.username,
      accountLevel: this.accountLevel,
      referralCode: this.referralCode || NOT_APPLICABLE,
      gender: this.gender || NOT_APPLICABLE,
      dateOfBirth: this.gender || NOT_APPLICABLE,
      hasVerifiedBvn: this.hasVerifiedBvn,
      hasVerifiedNin: this.hasVerifiedNin,
      hasUploadedUtilityBill: this.hasUploadedUtilityBill,
      hasAgreedToTerms: this.hasAgreedToTerms,
      profilePictureUrl: this.profilePictureUrl || NOT_APPLICABLE,
    }
  }
}
