exports.up = function (knex, Promise) {
    return knex.schema.createTable('stocks', tbl => {
        tbl.increments();

        tbl.string('ticker', 32)
            .notNullable();

        tbl.string('created_at')
            .notNullable();

        tbl.string('updated_at')
            .notNullable();

        tbl.json('data')
            .nullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('stocks');
};