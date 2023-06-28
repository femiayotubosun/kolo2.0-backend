import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RequestResetPasswordTokenRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string([
      rules.trim(),
      rules.escape(),
      rules.email(),
      rules.exists({
        table: 'users',
        column: 'email',
      }),
    ]),
  })

  public messages: CustomMessages = {
    'email.required': 'Email is required',
    'email.string': 'Email must be a string',
    'email.email': 'Email must be a valid email',
    'email.exists': 'No account associated with this email',
  }
}
