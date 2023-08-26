import { column } from '@ioc:Adonis/Lucid/Orm'
import AbstractModel from 'App/Common/Models/AbstractBaseModel'

export default class UserCard extends AbstractModel {
  @column({ isPrimary: true })
  public id: number
}
