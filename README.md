# DEX

This is a DEX ispired by [this design](https://www.figma.com/community/file/967630892045389378)
DEX is using [1inch API](https://portal.1inch.dev/) to perfom swaps
[Moralis API](https://docs.moralis.io/) is used to get balances of tokens in Wallet
[Alchemy API](https://dashboard.alchemy.com/) is used to get native token balance

In order to run backend:
1. Navigate to `crypto-dex-be`
2. Copy .env.example to .env and add your values
3.  Run ```npm i```
4. Run ```node index.js```

In order to run frontend:
1. Navigate to `crypto-dex-fe`
2. Copy .env.example to .env and add your values
3. Run ```npm i```
4. Run ```npm run dev```