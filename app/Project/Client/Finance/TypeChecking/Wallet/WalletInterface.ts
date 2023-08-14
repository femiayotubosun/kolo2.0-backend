import { DateTime } from 'luxon'

export default interface WalletInterface{
  id: number

  identifier: string

  createdAt: DateTime

  updatedAt: DateTime
}
