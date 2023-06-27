import { beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import AbstractModel from 'App/Common/Models/AbstractBaseModel'
import { DateTime } from 'luxon'
import OtpTokenActions from 'App/Project/Client/UserManagement/Actions/OtpTokenActions'

export default class OtpToken extends AbstractModel {
  @column()
  public tokenType: 'email-verification' | 'change-password' | 'reset-password' | 'login'

  @column()
  public token: string

  @column()
  public email: string

  @column()
  public isRevoked: boolean

  @column.dateTime()
  public expiresAt: DateTime

  @beforeCreate()
  public static async generateTokenExpiration(model: OtpToken) {
    model.expiresAt = await OtpTokenActions.generateOtpTokenExpirationTime()
  }
}
