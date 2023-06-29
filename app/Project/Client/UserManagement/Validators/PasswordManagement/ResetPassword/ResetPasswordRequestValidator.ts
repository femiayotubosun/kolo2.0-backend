import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string([rules.trim(), rules.escape(), rules.minLength(8)]),
  })

  public messages: CustomMessages = {
    'password.string': 'Password must ba a valid string',
    'password.required': 'Password is required',
    'password.minLength': `Password must be ${8} characters long`,
  }
}
