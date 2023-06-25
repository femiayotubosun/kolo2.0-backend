import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import businessConfig from 'Config/businessConfig'

export default class VerifyEmailRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    otp_token: schema.string([
      rules.minLength(businessConfig.otpToken.tokenLength),
      rules.maxLength(businessConfig.otpToken.tokenLength),
      rules.trim(),
      rules.escape(),
    ]),
  })

  public messages: CustomMessages = {
    'email_token.required': 'Email Token is compulsory',
    'email_token.string': 'Email token provided must be a string',
    'email_token.minLength': `Email Token provided must be ${businessConfig.otpToken.tokenLength} characters long`,
    'email_token.maxLength': `Email Token provided must be ${businessConfig.otpToken.tokenLength} characters long`,
  }
}
