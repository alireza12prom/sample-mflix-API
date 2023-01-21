module.exports = {
    $jsonSchema: {
        title: 'user schema',
        required: ['name', 'email', 'password'],
        properties: {
            name: {
                bsonType: 'string',
                description:
                    'must be a non-empty string and contain at least three charecters',
            },
            email: {
                bsonType: 'string',
                description: 'must be a non-empty string',
            },
            password: {
                bsonType: 'string',
            },
        },
    },
};
