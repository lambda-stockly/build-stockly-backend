
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', tbl => {
    tbl.increments();

    tbl.integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

    tbl.integer('stock_id')
        .notNullable()
        .references('id')
        .inTable('stocks')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

    tbl.timestamp('created_at')
        .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('favorites');
};