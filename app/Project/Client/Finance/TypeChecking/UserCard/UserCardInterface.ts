import { DateTime } from 'luxon'

export default interface UserCardInterface{
  id: number

  identifier: string

  createdAt: DateTime

  updatedAt: DateTime
}
