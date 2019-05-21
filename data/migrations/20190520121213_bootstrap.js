exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments();

        tbl.string('username', 36)
            .notNullable()
            .unique();

        tbl.string('email', 254)
            .notNullable()
            .unique();

        tbl.string('password', 254)
            .notNullable();

        tbl.timestamp('created_at')
            .defaultTo(knex.fn.now());

        tbl.timestamp('updated_at')
            .defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};