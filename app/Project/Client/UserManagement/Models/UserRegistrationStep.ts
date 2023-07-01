import { column } from '@ioc:Adonis/Lucid/Orm'
import AbstractModel from 'App/Common/Models/AbstractBaseModel'

export default class UserRegistrationStep extends AbstractModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public hasVerifiedAccount: boolean

  @column()
  public hasSecuredAccount: boolean

  @column()
  public hasUpgradedAccount: boolean

  public get forClient() {
    return {
      hasVerifiedAccount: this.hasVerifiedAccount,
      hasSecuredAccount: this.hasSecuredAccount,
      hasUpgradedAccount: this.hasUpgradedAccount,
    }
  }
}
