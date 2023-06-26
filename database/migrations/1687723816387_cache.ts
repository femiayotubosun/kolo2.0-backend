import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cache'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('key', 191).notNullable().primary()
      table.text('value', 'longtext').notNullable()
      table.timestamp('expiration', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
