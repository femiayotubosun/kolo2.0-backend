import { DateTime } from 'luxon'

export default interface UserInterface {
  id: number

  identifier: string

  email: string

  firstName: string

  lastName: string

  password?: string | null

  mobileNumber: string

  rememberMeToken: string | null

  lastLoginDate: DateTime

  isFirstTimeLogin: boolean | string

  loginAttempts: number

  isActive: boolean | string

  isDeleted: boolean | string

  createdAt: DateTime

  updatedAt: DateTime
}
