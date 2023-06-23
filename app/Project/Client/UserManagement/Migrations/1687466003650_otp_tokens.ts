import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OtpTokens extends BaseSchema {
  protected tableName = 'otp_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').notNullable()
      table
        .enum('token_type', [
          'login',
          'email-verification',
          'mobile-number-verification',
          'password-reset',
          'change-password',
        ])
        .nullable()
      table.string('token')
      table.string('email')
      table.boolean('is_revoked').defaultTo(0)
      table.dateTime('expires_at')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
