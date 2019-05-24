# build-stockly-backend
For our Backend Engineers. The core logic of our system lives here, communicating with DS, flowing downwards to FE.

# https://stockly-backend.herokuapp.com/

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
        {
            "id": 1,
            "ticker": "AAPL",
            "created_at": "1519211809934",
            "updated_at": "1519211809934",
            "data": {
                "actionThresholds": {
                    "TA": {
                        "sell": 0.13,
                        "hold": 0.66,
                        "buy": 0.21
                    },
                    "Sentiment": {
                        "sell": 0.5,
                        "hold": 0.25,
                        "buy": 0.25
                    }
                }
            }
        },
        ...
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
    ticker: "AMZN"
}
```
**Returns:**
```
{
    [
        {
            "id": 1,
            "ticker": "AAPL",
            "created_at": "1519211809934",
            "updated_at": "1519211809934",
            "data": {
                "actionThresholds": {
                    "TA": {
                        "sell": 0.13,
                        "hold": 0.66,
                        "buy": 0.21
                    },
                    "Sentiment": {
                        "sell": 0.5,
                        "hold": 0.25,
                        "buy": 0.25
                    }
                }
            }
        },
        ...
    ]
}
```

## DELETE /favorites
### Protected Route
- Deletes a user's favorite stock

**Expected Header:**
```
Authorization: "token from local storage or app state"
```
**Expected Payload:**
```
{
    ticker: "AMZN"
}
```
**Returns:**
```
{
    [
        {
            "id": 1,
            "ticker": "AAPL",
            "created_at": "1519211809934",
            "updated_at": "1519211809934",
            "data": {
                "actionThresholds": {
                    "TA": {
                        "sell": 0.13,
                        "hold": 0.66,
                        "buy": 0.21
                    },
                    "Sentiment": {
                        "sell": 0.5,
                        "hold": 0.25,
                        "buy": 0.25
                    }
                }
            }
        },
        ...
    ]
}
```

## GET /stocks
### Protected Route
- Returns all unique stocks' information that have been searched previously

**Expected Header:**
```
Authorization: "token from local storage or app state"
```

**Returns:**
```
{
    [
        {
            id: 1,
            ticker: "AMZN",
            created_at: "1519211809934",
            updated_at: "1519211809934",
            data: {
                actionThresholds: {
                    TA: {
                        sell: 0.38,
                        hold: 0.43,
                        buy: 0.19
                    },
                    Sentiment: {
                        sell: 0.5,
                        hold: 0.25,
                        buy: 0.25
                    }
                }
            }
        },
        ...
    ]
}
```

## GET /stocks/:ticker
### Protected Route
- Returns a stock's information

**Expected Header:**
```
Authorization: "token from local storage or app state"
```

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

## GET /top
### Protected Route
- Returns the top 5 most searched for stocks

**Expected Header:**
```
Authorization: "token from local storage or app state"
```

**Returns:**
```
{
    [
        {
            "rank": 1,
            "ticker": "B",
            "number_of_searches": 25,
            "created_at": "1558663802271.0",
            "updated_at": {
                "id": 6,
                "ticker": "B",
                "created_at": "1558663802271.0",
                "updated_at": "1558663818489.0"
            }
        },
        ...
    ]
}
```