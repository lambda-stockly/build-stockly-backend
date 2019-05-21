exports.up = function (knex, Promise) {
    return knex.schema.createTable('searches', tbl => {
        tbl.increments();

        tbl.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('RESTRICT')
            .onUpdate('CASCADE');

        tbl.string('ticker', 32)
            .notNullable();

        tbl.timestamp('created_at')
            .defaultTo(knex.fn.now());

        tbl.boolean('new_response')
            .defaultTo(knex.fn.now());

        tbl.json('response').nullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('searches');
};