## Simple Movie Apis

Simple rest api by express and mongodb.

### Register & Auth Endpoints

- register
  - POST `/register`
  - Body
    - name
    - email
    - password
- authetication

  - POST `/auth`
  - Request Body
    - email
    - password
  - Response Body

    - Bearer token

### Movie Endpoints

- get all movies

  - GET `/api/v1/movies`
  - Queries (Optional)
    - page
    - per_page
    - rel
    - lan(language)
    - gen(genre)
    - year
    - cnt(country)
    - q
  - Request Header

    - Authorization

- get a single movie

  - GET `/api/v1/movies/:movieId`
  - Request Header

    - Authorization

- like a movie

  - POST `/api/v1/movies/:movieId/like`
  - Request Header

    - Authorization

- unlike a movie

  - DELETE `/api/v1/movies/:movieId/like`

  - Request Header

    - Authorization

- post a comment

  - POST `/api/v1/movies/:movieId/comment`
  - Request Body

    - text

  - Request Header

    - Authorization

- delete a comment

  - DELETE `/api/v1/movies/:movieId/comment`
  - Request Header

    - Authorization

- edit a comment

  - PATCH `/api/v1/movies/:movieId/comment`
  - Request Body

    - text

  - Request Header

    - Authorization

### User Endpoints

- check a user that exists or not

  - HEAD `/user/:userId`
  - Request Header

    - Authorization

- get all users

  - GET `/user`
  - Request Header

    - Authorization

- get a single user

  - GET `/user/:userId`
  - Request Header

    - Authorization

- create a user

  - POST `/user/:userId`
  - Request Body
    - name
    - email
    - password
  - Request Header

    - Authorization

- delete a user

  - DELETE `/user/:userId`
  - Request Header

    - Authorization

- update a user

  - PATCH `/user/:userId`
  - Request Body
    - name
    - email
    - password
  - Request Header

    - Authorization
