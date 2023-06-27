import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthenticateUserWithPasswordRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string([rules.email(), rules.trim(), rules.escape()]),
    password: schema.string([]),
  })

  public messages: CustomMessages = {
    'email.required': 'Email is required',
    'email.email': 'Email must be a valid email',
    'password.required': 'Password is required',
  }
}
