import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Rooms extends BaseSchema {
  protected tableName = 'rooms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('rid').unique().notNullable()
      table.integer('max_connect').defaultTo(1)
      table.boolean('expired').defaultTo(false)
      table.boolean('deleted').defaultTo(false)
      table.text('options').nullable()

      table.string('user_code').nullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
