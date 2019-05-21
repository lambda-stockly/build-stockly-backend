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
axios

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
    actionThresholds: {
        TA: {
            sell: 0.5,
            hold: 0.25,
            buy: 0.25
        },
        Sentiment: {
            sell: 0.5,
            hold: 0.25,
            buy: 0.25
        }
    }
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

### GET /favorites
## Protected Route
**Expected Header:**
```
Authorization: "token from local storage or app state"
```
**Returns:**
```
{
    [
        "AMZN",
        "GOOG",
        "JPM",
        "AAPL"
    ]
}
```

### POST /favorites
## Protected Route
**Expected Header:**
```
Authorization: "token from local storage or app state"
```
**Expected Payload:**
```
{
    "AMZN"
}
```
**Returns:**
```
{
    [
        "AMZN",
        "GOOG",
        "JPM",
        "AAPL"
    ]
}
```

### DELETE /favorites
## Protected Route
**Expected Header:**
```
Authorization: "token from local storage or app state"
```
**Expected Payload:**
```
{
    "AMZN"
}
```
**Returns:**
```
{
    [
        "GOOG",
        "JPM",
        "AAPL"
    ]
}
```

### GET /stocks/:ticker
**Expected Parameter:** The ticker symbol of the stock
**Returns:**
```
{
    ticker: "AMZN",
    actionThresholds: {
        TA: {
            sell: 0.5,
            hold: 0.25,
            buy: 0.25
        },
        Sentiment: {
            sell: 0.5,
            hold: 0.25,
            buy: 0.25
        }
    }
}
```

### GET /top/searched
**Returns:**
```
{
    [
        "AMZN",
        "GOOG",
        "JPM",
        "AAPL"
    ]
}
```

### GET /top/favorited
**Returns:**
```
{
    [
        "AMZN",
        "GOOG",
        "JPM",
        "AAPL"
    ]
}
```