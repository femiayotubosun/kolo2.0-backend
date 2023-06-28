import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string([rules.trim(), rules.escape(), rules.minLength(8), rules.maxLength(8)]),
  })

  public messages: CustomMessages = {
    'password.string': 'Otp Token must ba a valid string',
    'password.required': 'Otp Token is required',
    'password.minLength': `Otp Token must be ${8} characters long`,
    'password.maxLength': `Otp Token must ba ${8} characters long,`,
  }
}
