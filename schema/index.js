const { Users, client } = require("../database");
const DB = process.env.MONGO_DB;

// schemas
const userSchema = require('./user.schema');

class Schema {
    constructor() {}

    static setup(schema, collIns) {
        return client.db(DB).command({ 
            collMod: collIns.collectionName,
            validator: schema
            })
            .catch(() => {
                console.log(`/!\\ Unable to set schema for collection ${collIns.collectionName}`);
            });
    }
}

// start when server connect successfully
client.on('connected', () => {
    console.log("*** Setup Schemas ***");
    Schema.setup(userSchema, Users);
})