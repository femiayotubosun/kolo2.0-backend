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

  @column({ serializeAs: null })
  public password: string

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
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public isFirstTimeLogin: boolean | string

  @column({
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public hasVerifiedEmail: boolean | string

  @column()
  public loginAttempts: number

  @column({
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public isActive: boolean | string

  @column({
    consume: (value: number) => (value === 1 ? 'Yes' : 'No'),
  })
  public isDeleted: boolean | string

  @hasOne(() => UserProfile)
  public profile: HasOne<typeof UserProfile>

  @hasOne(() => UserRegistrationStep)
  public userRegistrationStep: HasOne<typeof UserRegistrationStep>
  //
  // @hasOne(() => Wallet, {
  //   foreignKey: 'userId',
  // })
  // public akibaWallet: HasOne<typeof Wallet>
  //
  // @hasMany(() => StandardSaving, {
  //   foreignKey: 'userId',
  // })
  // public standardSavings: HasMany<typeof StandardSaving>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
