import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import businessConfig from 'Config/businessConfig'

export default class VerifyEmailRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    otpToken: schema.string([
      rules.minLength(businessConfig.otpToken.tokenLength),
      rules.maxLength(businessConfig.otpToken.tokenLength),
      rules.trim(),
      rules.escape(),
      rules.exists({
        table: 'otp_tokens',
        column: 'token',
      }),
    ]),
  })

  public messages: CustomMessages = {
    'otpToken.required': 'OTP Token is compulsory',
    'otpToken.string': 'OTP Token provided must be a string',
    'otpToken.minLength': `OTP Token provided must be ${businessConfig.otpToken.tokenLength} characters long`,
    'otpToken.maxLength': `OTP Token provided must be ${businessConfig.otpToken.tokenLength} characters long`,
    'otpToken.exists': 'OTP Token must be valid',
  }
}
