
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', tbl => {
    tbl.increments();

    tbl.integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

    tbl.integer('stock_ticker')
        .notNullable()
        .references('ticker')
        .inTable('stocks')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

    tbl.string('created_at')
      .notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('favorites');
};