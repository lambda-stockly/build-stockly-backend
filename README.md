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
    id: 1
    username: "bob",
    email: "bob@gmail.com",
    password: "pass123",
    created_at: "1519211809934",
    updated_at: "1519211809934"
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

## Favorites & Top
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

# Endpoints

## POST /auth/login
- Log an existing user in

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

## POST /auth/register
- Register a new user

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

## GET /favorites
### Protected Route
- Get a user's favorite stocks

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

## POST /favorites
### Protected Route
- Add to a user's favorite stocks

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

## DELETE /favorites
### Protected Route
- Delete a user's favorite stock

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

## GET /stocks
- Get all stock information

**Returns:**
```
[
    {
        "id": 1,
        "ticker": "AMZN",
        "created_at": "2019-05-21 21:33:28",
        "updated_at": "2019-05-21 21:33:28",
        "actionThresholds": {
            "actionThresholds": {
                "TA": {
                    "sell": 0.38,
                    "hold": 0.43,
                    "buy": 0.19
                },
                "Sentiment": {
                    "sell": 0.5,
                    "hold": 0.25,
                    "buy": 0.25
                }
            }
        }
    },
    {
        "id": 2,
        "ticker": "GOOG",
        "created_at": "2019-05-21 21:43:25",
        "updated_at": "2019-05-21 21:43:25",
        "actionThresholds": {
            "actionThresholds": {
                "TA": {
                    "sell": 0.38,
                    "hold": 0.43,
                    "buy": 0.19
                },
                "Sentiment": {
                    "sell": 0.5,
                    "hold": 0.25,
                    "buy": 0.25
                }
            }
        }
    }
]
```

## GET /stocks/:ticker
- Get a stock's information

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

## GET /top/searched
- Get the most searched for stocks

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

## GET /top/favorited
- Get the most favorited stocks

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