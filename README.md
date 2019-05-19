# build-stockly-backend
For our Backend Engineers. The core logic of our system lives here, communicating with DS, flowing downwards to FE.

# NPM Packages
```
express
helmet
cors
knex
sqlite3
pg
jsonwebtoken
```

# Resource Schemas

## Users
```
{
    username: "bob",
    email: "bob@gmail.com",
    password: "pass123"
}
```

## Stocks
```
{
    ticker: "AMZN",
    name: "Amazon"
}
```

# Endpoints

## Authorization

### GET /auth/login
**Expected Payload:**
```
{
    username: "bob",
    password: "pass123"
}
```
**Returns:**
```
{
    token: "token"
    user: {
        username: "bob",
        email: "bob@gmail.com"
    }
}
```

### POST /auth/register
**Expected Payload:**
```
{
    email: "bob@gmail.com",
    username: "bob",
    password: "pass123"
}
```
**Returns:**
```
{
    token: "token"
    user: {
        username: "bob",
        email: "bob@gmail.com"
    }
}
```