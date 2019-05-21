exports.up = function (knex, Promise) {
    return knex.schema.createTable('stocks', tbl => {
        tbl.increments();

        tbl.string('ticker', 32)
            .notNullable();

        tbl.timestamp('created_at')
            .defaultTo(knex.fn.now());

        tbl.timestamp('updated_at')
            .defaultTo(knex.fn.now());

        tbl.json('data').nullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('stocks');
};