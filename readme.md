### Movie Apis

this is a simple rest api project with express and mongodb sample database.

> Base url: http://{host}:{port}

## Authentication Endpoints

| Endpoint  | Method | Description    |
| --------- | ------ | -------------- |
| /auth     | Post   | Authentication |
| /register | Post   | Registeration  |

### Request body

```
# /auth
{
    email: "john@example.com",
    password: "john123456"
}

# /register
{
    name: "john"
    email: "john@example.com",
    password: "john123456"
}
```

<br>

> NOTE: After authenticating, the server return a `JWT` token. this token is valid just fo 12h.

## Movie Endpoints

| Endpoint            | Method | Description             | Access     | Authorization |
| ------------------- | ------ | ----------------------- | ---------- | ------------- |
| /api/v1/movies      | Get    | Get all movies          | User/Admin | Bearer Token  |
| /api/v1/movie/:id   | Get    | Get a movie             | User/Admin | Bearer Token  |
| /api/v1/:id/like    | Post   | Like a movie            | User/Admin | Bearer Token  |
| /api/v1/:id/comment | Delete | Unlike a movie          | User/Admin | Bearer Token  |
| /api/v1/:id/comment | Post   | Submit a comment        | User/Admin | Bearer Token  |
| /api/v1/:id/like    | Delete | Delete submited comment | User/Admin | Bearer Token  |

### Request body

```
# Post /api/v1/:id/comment

{
    test: "Your comment"
}
```

<br>

> NOTE: For all request you need to a `JWT` token in header as a `Bearer`.

## User Endpoints

| Endpoint   | Method | Description                     | Access | Authorization |
| ---------- | ------ | ------------------------------- | ------ | ------------- |
| /users     | Get    | Get all users                   | Admin  | Bearer Token  |
| /users     | Post   | Create a user                   | Admin  | Bearer Token  |
| /users/:id | Head   | Check user exists or not        | Admin  | Bearer Token  |
| /users/:id | Get    | Get a single user               | Admin  | Bearer Token  |
| /users/:id | Put    | Replace all field with new info | Admin  | Bearer Token  |
| /users/:id | Patch  | Update a specify field          | Admin  | Bearer Token  |
| /users/:id | Delete | Delete a user                   | Admin  | Bearer Token  |

### Request body

```
# Post /users

{
    name: "",
    email:"",
    password:""
}

# Put /users/:id

{
    name: "",
    email:""
}

# Patch /users/:id

{
    name: ""
}

#or

{
    email:""
}
```

<br>

> NOTE: For all request you need to a `JWT` token in header as a `Bearer`.
