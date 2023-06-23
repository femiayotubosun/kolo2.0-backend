import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_registration_steps'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.boolean('has_verified_account').defaultTo(false)
      table.boolean('has_secured_account').defaultTo(false)
      table.boolean('has_upgraded_account').defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
