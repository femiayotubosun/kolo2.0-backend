import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('identifier').notNullable()
      table.string('email').notNullable().unique()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.enum('account_type', ['server', 'google']).defaultTo('server')
      table.string('password', 180).nullable()
      table.string('mobile_number').notNullable()
      table.string('remember_me_token').nullable()
      table.dateTime('last_login_date')
      table.boolean('is_first_time_login').defaultTo(1)
      table.boolean('has_verified_email').defaultTo(0)
      table.integer('login_attempts').defaultTo(0)
      table.boolean('is_active').notNullable().defaultTo(0)
      table.boolean('is_deleted').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
