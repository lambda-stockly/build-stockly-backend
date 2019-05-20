A. Stock summaries, charts and thresholds of action page
- Directly with alphaadvantage
A1. Stocks only? IE. Equities? Or also Index funds, commodities, etc?
- Equities
A2. Stock summaries as in a short textual description, or summaries as in recent valuation prices and statistics?
- Directly with alphaadvantage
A3. What type of charts? Price? Threshold of Action? Daily? Weekly? Monthly? Etc... How many and of what variety?

A4. "thresholds of action" - BUY SELL OR HOLD - on a spectrum

B. Leaderboard Page
- Ranked by threshold
B2. Is it an aggregate leaderboard made up of several data points?
- Maybe for stretch, first only 1

C. Tweet sentiment analysis
C1. How will this be measured? On what scale
- 0 through 100

DS API:
Request: A POST request which name='ticker'
Response: {
    'TA': {
        'sell':0.5,'hold':0.25,'buy':0.25
    }, 
    'Sentiment': {
        'sell:0.5,'hold':0.25,'buy':0.25
    }
}

Process:
Get stock info
Perform technical analysis
Get company info
Get stock news analysis

Pass stock symbol to DS api