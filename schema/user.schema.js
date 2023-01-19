module.exports = {
    title: 'user schema',
    required: [
        'name',
        'email',
        'password'
    ],
    additionalProperties: false,
    properties: {
        name: {
            bsonType: 'string',
            description: 'must be a non-empty string and contain at least three charecters',
            mimLength: 3
        },
        email: {
            bsonType: 'string',
            description: 'must be a non-empty string'
        },
        password: {
            bsonType: 'string'
        }
    }
}