import { beforeSave, column, computed, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import AbstractModel from 'App/Common/Models/AbstractBaseModel'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import UserProfile from 'App/Project/Client/UserManagement/Models/UserProfile'
import UserRegistrationStep from 'App/Project/Client/UserManagement/Models/UserRegistrationStep'

export default class User extends AbstractModel {
  @column()
  public email: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @computed()
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  @column()
  public accountType: 'server' | 'google'

  @column({ serializeAs: null })
  public password: string | null

  @column()
  public mobileNumber: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({
    serialize: (dateValue: DateTime | null) => {
      return dateValue ? dateValue.setZone('utc').toLocaleString(DateTime.DATETIME_FULL) : dateValue
    },
  })
  public lastLoginDate: DateTime

  @column({
    consume: (value: number) => (value ? 'Yes' : 'No'),
  })
  public isFirstTimeLogin: boolean | string

  @column({
    consume: (value: number) => (value ? 'Yes' : 'No'),
  })
  public hasVerifiedEmail: boolean | string

  @column()
  public loginAttempts: number

  @column({
    consume: (value: number) => (value ? 'Yes' : 'No'),
  })
  public isActive: boolean | string

  @column({
    consume: (value: number) => (value ? 'Yes' : 'No'),
  })
  public isDeleted: boolean | string

  @hasOne(() => UserProfile)
  public profile: HasOne<typeof UserProfile>

  @hasOne(() => UserRegistrationStep)
  public userRegistrationStep: HasOne<typeof UserRegistrationStep>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password!)
    }
  }

  public get forClient() {
    return {
      identifier: this.identifier,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      accountType: this.accountType,
      mobileNumber: this.mobileNumber,
      hasVerifiedEmail: this.hasVerifiedEmail,
      meta: {
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        lastLoginDate: this.lastLoginDate,
      },
    }
  }
}
