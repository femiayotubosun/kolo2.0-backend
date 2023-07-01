import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').notNullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('customer_code').nullable().unique()
      table.string('username').nullable().unique()
      table.integer('account_level').defaultTo(1)
      table.string('referral_code').nullable().unique()
      table.enum('gender', ['male', 'female', 'other']).nullable()
      table.date('date_of_birth').nullable()
      table.boolean('has_verified_bvn').defaultTo(false)
      table.boolean('has_verified_nin').defaultTo(false)
      table.boolean('has_uploaded_utility_bill').defaultTo(false)
      table.integer('country_id').nullable()
      table.integer('state_id').nullable()
      table.integer('city_id').nullable()
      table.string('street_address').nullable()
      table.boolean('has_agreed_to_terms').defaultTo(false)
      table.string('profile_picture_url').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
