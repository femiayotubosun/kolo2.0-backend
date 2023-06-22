import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckUsernameAvailabilityRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string([
      rules.trim(),
      rules.escape(),
      rules.unique({
        table: 'user_profiles',
        column: 'username',
      }),
      rules.regex(/^[a-zA-Z0-9_.]+$/),
    ]),
  })

  public messages: CustomMessages = {
    'username.required': 'Username is required',
    'username.string': 'Username provided must be a string',
    'username.unique': 'Username is unavailable. Please try a different username',
    'username.regex': 'Username can only contain letters, numbers, underscores, and periods',
  }
}
