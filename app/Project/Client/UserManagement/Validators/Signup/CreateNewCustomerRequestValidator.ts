import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateNewCustomerRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    first_name: schema.string([rules.trim(), rules.escape()]),
    last_name: schema.string([rules.trim(), rules.escape()]),
    email: schema.string([
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
      }),
    ]),

    password: schema.string([rules.trim(), rules.escape()]),
    mobile_number: schema.string([rules.trim(), rules.escape()]),
  })

  public messages: CustomMessages = {
    'email.email': 'Email must be a valid email address',
    'email.unique': 'Email is already in use',
    'email.required': 'Your Email is compulsory',
    'first_name.required': 'First name is compulsory',
    'first_name.string': 'First name provided must be a string',
    'last_name.required': 'Last name is compulsory',
    'last_name.string': 'Last name provided must be a string',
    'password.required': 'Please provide a password',
    'password.string': 'Password provided must be a string',
    'mobile_number.required': 'Mobile number is compulsory',
    'mobile_number.string': 'Mobile number must be a string',
  }
}
