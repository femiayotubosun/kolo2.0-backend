import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthenticateUserWithSingleUseCodeRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
  })

  public messages: CustomMessages = {
  }
}
