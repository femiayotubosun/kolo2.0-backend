import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'wallets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').notNullable()
      table.integer('user_id').notNullable()
      table.string('account_number').notNullable()
      table.string('pin').nullable()
      table.bigInteger('balance').defaultTo('0')
      table.bigInteger('total_outflow').defaultTo('0')
      table.bigInteger('total_inflow').defaultTo('0')
      table.boolean('is_first_time_funding').defaultTo(true)
      table.boolean('is_active').defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
