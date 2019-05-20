# build-stockly-backend
For our Backend Engineers. The core logic of our system lives here, communicating with DS, flowing downwards to FE.

# NPM Packages
```
production:
express
helmet
cors
knex
pg
jsonwebtoken
bcrypt

development:
dotenv
sqlite3
cross-env
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

### POST /auth/login
**Expected Payload:**
```
{
    email: "bob@gmail.com",
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