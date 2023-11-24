# FYP Project 38 Functional POC

# FYP Project 38 Functional POC - Backend - AUB, Beirut, Lebanon

This is an MVP version for our backend systems supporting the most foundational capabilities regarding authentication, authorization, user and application management

## Dependencies

```json
			  "@prisma/client": "^5.6.0",
        "@types/express-rate-limit": "^6.0.0",
        "bcrypt": "^5.1.0",
        "cookie-parser": "^1.4.6",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1",
        "express": "^4.18.2",
        "express-rate-limit": "^6.8.1",
        "jsonwebtoken": "^9.0.1",
        "mysql2": "^3.5.0",
        "prisma": "^5.6.0",
        "yup": "^1.2.0"
```

## Development Dependencies

```json
        "@types/bcrypt": "^5.0.0",
        "@types/cookie-parser": "^1.4.3",
        "@types/express": "^4.17.17",
        "@types/jest": "^29.5.2",
        "@types/jsonwebtoken": "^9.0.2",
        "@types/node": "^20.3.1",
        "concurrently": "^8.2.0",
        "jest": "^29.5.0",
        "nodemon": "^2.0.22",
        "supertest": "^6.3.3",
        "ts-jest": "^29.1.0",
        "typescript": "^5.1.3"
```

## Installation

- Install [node](https://nodejs.org/en/blog/release/v18.17.1) v18.17.1
- Run the following command to install dependencies:

```bash
npm install
```

- Create a .env in the root project directory as follows:

```bash
DB_USER=exampleUser
DB_PASS=examplePassword
DB_NAME=exampleDBName
ACCESS_TOKEN_SECRET=useRandomLongString
REFRESH_TOKEN_SECRET=useRandomLongString
DATABASE_URL="mysql://exampleUser:examplePassword.@exampleIP:3306/exampleDBName"
```

## Quickstart

You can run the following command to compile:

```bash
npm run build
```

Once the project compiles and you see “dist” directory, you can simply run:

```bash
npm start
```

To start in watch & dev mode:

```bash
npm run dev
```

## Auth

### Signup

```bash
HTTP POST /api/auth/signup
```

Expects:

```json
{
  "firstName": "John",
  "middleName": "J",
  "lastName": "Doe",
  "sSN": 376,
  "phoneNumber": 3253678,
  "email": "john@example.com",
  "address": "nowhere's ville",
  "extraNotes": "this is an optional parameter",
  "role": "user"
}
```

Returns:

```json
{
  "registrationCode": "uuid"
}
```

Status codes:

- 201 Created
- 400 Bad Request
- 409 Conflict
- 500 Internal Server Error

Things to note:

- role is an enum: [user,admin]

### Register

```bash
HTTP POST /api/auth/register
```

Expects:

```json
{
  "registrationCode": "valid_uuid",
  "password": "examplePass"
}
```

Returns:

```json
"created": {
        "id": 25,
        "firstName": "John",
        "middleName": "J",
        "lastName": "Doe",
        "sSN": 376,
        "phoneNumber": 3253678,
        "email": "john@example.com",
        "address":"nowhere's ville",
        "extraNotes": "this is an optional parameter",
        "role": "user",
        "registrationCode": "44d3a21a-244d-4a46-91b8-3b970dd0f314",
        "registered": false,
        "createdAt": "2023-11-24T12:52:43.820Z",
        "updatedAt": "2023-11-24T12:52:43.820Z",
        "password": null
    }
```

Status codes:

- 200 OK
- 400 Bad Request
- 500 Internal Server Error

### Login

```bash
HTTP POST /api/auth
```

Expects:

```json
{
  "username": "john71@example.com",
  "password": "123ghj5678"
}
```

Returns:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6ImpvaG43MUBleGFtcGxlLmNvbSIsInJvbGVzIjoiYWRtaW4ifSwiaWF0IjoxNzAwODMwNjcxLCJleHAiOjE3MDA4MzE1NzF9.63DERZvdxFi5PHEC52MbuUlzbSIo_AzvFoseY8rwMQs"
}
```

Status codes:

- 200 OK
- 400 Bad Request
- 401 Unauthorized
- 500 Internal Server Error

Things to note:

- This request also sets an HTTP-ONLY cookie containing the refresh token valid for 7 days. (it is highly recommended to shrink this time)
- The access token returned is valid for 15 minutes.
- Both tokens are hashed with SHA256

### Refresh

```bash
HTTP GET /api/auth/refresh
```

Returns:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6ImpvaG43MUBleGFtcGxlLmNvbSIsInJvbGVzIjoiYWRtaW4ifSwiaWF0IjoxNzAwODMwNjcxLCJleHAiOjE3MDA4MzE1NzF9.63DERZvdxFi5PHEC52MbuUlzbSIo_AzvFoseY8rwMQs"
}
```

Status codes:

- 200 OK
- 401 Unauthorized
- 500 Internal Server Error

Things to note:

- This requests checks and validates the refresh token in the cookies.

### Logout

```bash
HTTP POST /api/auth/logout
```

Status codes:

- 200 OK
- 500 Internal Server Error

Things to note:

- This clears the refresh token from the cookies

## Users

For the following endpoints, only admins are allowed to utilize them:

### Get All Users + Filtering

```bash
HTTP GET /api/users?firstName=John&LastName=doe
```

Returns:

```json
[
  {
    "id": 25,
    "firstName": "John",
    "middleName": "J",
    "lastName": "Doe",
    "sSN": 376,
    "phoneNumber": 3253678,
    "email": "john@example.com",
    "address": "nowhere's ville",
    "extraNotes": "this is an optional parameter",
    "role": "user",
    "registrationCode": "44d3a21a-244d-4a46-91b8-3b970dd0f314",
    "registered": false,
    "createdAt": "2023-11-24T12:52:43.820Z",
    "updatedAt": "2023-11-24T12:52:43.820Z",
    "password": null
  }
]
```

Status codes:

- 200 OK
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

Things to note:

- This request accepts all attributes of user object as filters

### Get User by ID

```bash
HTTP GET /api/users/{user-id}
```

Returns:

```json
[
 {
        "id": {user-id},
        "firstName": "John",
        "middleName": "J",
        "lastName": "Doe",
        "sSN": 376,
        "phoneNumber": 3253678,
        "email": "john@example.com",
        "address":"nowhere's ville",
        "extraNotes": "this is an optional parameter",
        "role": "user",
        "registrationCode": "44d3a21a-244d-4a46-91b8-3b970dd0f314",
        "registered": false,
        "createdAt": "2023-11-24T12:52:43.820Z",
        "updatedAt": "2023-11-24T12:52:43.820Z",
        "password": null
    }
]
```

Status codes:

- 200 OK
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

### Patch User

```bash
HTTP PATCH /api/users/{user-id}
```

Expects

```json
{
  "firstName": "Jane"
}
```

Returns:

```json
[
 {
        "id": {user-id},
        "firstName": "Jane",
        "middleName": "J",
        "lastName": "Doe",
        "sSN": 376,
        "phoneNumber": 3253678,
        "email": "john@example.com",
        "address":"nowhere's ville",
        "extraNotes": "this is an optional parameter",
        "role": "user",
        "registrationCode": "44d3a21a-244d-4a46-91b8-3b970dd0f314",
        "registered": false,
        "createdAt": "2023-11-24T12:52:43.820Z",
        "updatedAt": "2023-11-24T12:52:43.820Z",
        "password": null
    }
]
```

Status codes:

- 200 OK
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error
- 409 Conflict

Things to note:

- This request accepts all attributes in the body for change with the exception of id

### Delete User

```bash
HTTP DELETE /api/users/{user-id}
```

Status codes:

- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

## Jobs

Please note the policy regarding the following endpoints:

- An admin has ultimate privilege, meaning they can retrieve, edit, add and update any record
- A user may only read, edit, add, or delete their applications/jobs
- A user may not be able to access other user’s jobs/applications

### Add Job

```bash
HTTP POST /api/auth/jobs
```

Header:

```json
{
  "Authorization": "Bearer <access-token>"
}
```

Expects:

```json
{
  "owner": 9,
  "status": "waiting",
  "phase": "start",
  "bucket": "this is an optional parameter"
}
```

Returns:

```json
{
    "id": "31a116f6-ea09-4efd-8f0c-8b9e29137691",
    "createdAt": "2023-11-24T13:24:33.643Z",
    "updatedAt": "2023-11-24T13:24:33.643Z",
    "owner": {user-if},
    "status": "start",
    "phase": "start",
    "bucket": "path/to/user/bucket"
}
```

Status codes:

- 201 Created
- 400 Bad Request
- 500 Internal Server Error

### Get All Jobs + Filtering

```bash
HTTP GET /api/auth/jobs?status=waiting&phase=two
```

Returns:

```json
[
  {
    "id": "31a116f6-ea09-4efd-8f0c-8b9e29137691",
    "createdAt": "2023-11-24T13:24:33.643Z",
    "updatedAt": "2023-11-24T13:24:33.643Z",
    "owner": 9,
    "status": "waiting",
    "phase": "start",
    "bucket": null
  }
]
```

Status codes:

- 200 OK
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

Things to note:

- This request accepts all attributes of user object as filters

### Get Job by ID

```bash
HTTP GET /api/jobs/{job-id}
```

Returns:

```json
{
    "id": {job-id},
    "createdAt": "2023-11-24T13:24:33.643Z",
    "updatedAt": "2023-11-24T13:24:33.643Z",
    "owner": 9,
    "status": "waiting",
    "phase": "start",
    "bucket": null
}
```

Status codes:

- 200 OK
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

### Patch Job

```bash
HTTP PATCH /api/jobs/{job-id}
```

Expects

```json
{
  "status": "Complete"
}
```

Returns:

```json
{
    "id": {job-id},
    "createdAt": "2023-11-24T13:24:33.643Z",
    "updatedAt": "2023-11-24T13:24:33.643Z",
    "owner": 9,
    "status": "Complete",
    "phase": "start",
    "bucket": null
}
```

Status codes:

- 200 OK
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error
- 409 Conflict

Things to note:

- This request accepts all attributes in the body for change with the exception of id

### Delete Job

```bash
HTTP DELETE /api/jobs/{job-id}
```

Status codes:

- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

## JWT

### Access Token

```json
{
  "UserInfo": {
    "username": "example",
    "roles": "example"
  }
}
```

### Refresh Token

```json
{
  {
    "username": "example",
  }
}
```

## Login Limiter

```javascript

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per `window` per minute
    message:
        { message: 'Too many login attempts from this IP, please try again after a 60 second pause' },
    handler: (req: Request, res: Response, next: NextFunction, options:any) => {
        console.log(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
})

```
