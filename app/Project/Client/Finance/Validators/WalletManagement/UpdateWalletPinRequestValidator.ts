import { CustomMessages, schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateWalletPinRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    walletPin: schema.string({ trim: true, escape: true }, [
      rules.maxLength(4),
      rules.minLength(4),
    ]),
  })

  public messages: CustomMessages = {
    'walletPin.required': 'Wallet Pin is required',
    'walletPin.string': 'Wallet Pin Provided should be a string',
    'walletPin.maxLength': 'Wallet Pin must be 4 characters long',
    'walletPin.minLength': 'Wallet Pin must be 4 characters long',
  }
}
