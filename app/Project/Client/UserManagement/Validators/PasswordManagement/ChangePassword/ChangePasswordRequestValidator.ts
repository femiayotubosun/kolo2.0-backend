import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChangePasswordRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    oldPassword: schema.string([rules.trim(), rules.escape()]),
    newPassword: schema.string([rules.trim(), rules.escape(), rules.minLength(8)]),
  })

  public messages: CustomMessages = {
    'oldPassword.required': 'Old password is required',
    'oldPassword.string': 'Old password must be a string',
    'newPassword.required': 'Old password is required',
    'newPassword.string': 'Old password must be a string',
    'newPassword.minLength': 'New password must be at least 8 characters',
  }
}
