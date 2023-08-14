import { column } from '@ioc:Adonis/Lucid/Orm'
import AbstractModel from 'App/Common/Models/AbstractBaseModel'

export default class Wallet extends AbstractModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public accountNumber: string

  @column()
  public pin: string | null

  @column()
  public balance: string

  @column()
  public totalOutflow: string

  @column()
  public totalInflow: string

  @column()
  public isFirstTimeFunding: boolean

  @column()
  public isActive: boolean

  public forClient() {
    return {
      accountNumber: this.accountNumber,
      balance: this.balance,
      totalOutflow: this.totalOutflow,
      totalInflow: this.totalInflow,
      meta: {
        hasSetPin: this.pin !== null,
      },
    }
  }
}
