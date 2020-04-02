exports.up = function (knex) {
    return knex.schema.createTable('messages', messages => {
        messages.increments('messages_id');
        messages
            .integer('users_id')
            .references('users_id')
            .inTable('users');
        messages
            .string('message')
            .notNullable()
        messages
            .string('username')
            .notNullable()
        messages.timestamps(true, true)

    });

};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('messages');
};