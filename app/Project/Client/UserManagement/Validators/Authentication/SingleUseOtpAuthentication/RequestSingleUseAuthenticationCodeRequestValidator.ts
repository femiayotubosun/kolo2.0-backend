import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RequestSingleUseAuthenticationCodeRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string([
      rules.email(),
      rules.trim(),
      rules.escape(),
      rules.exists({
        table: 'users',
        column: 'email',
      }),
    ]),
  })

  public messages: CustomMessages = {
    'email.required': 'Email is required',
    'email.email': 'Email must be a valid email',
    'email.exists': 'Invalid Credentials',
  }
}
