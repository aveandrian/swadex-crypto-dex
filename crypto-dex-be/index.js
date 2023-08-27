import express, { json } from 'express';
import cors from 'cors';
import { Alchemy, Network, Utils } from "alchemy-sdk";
import Moralis from 'moralis'
// Import the EvmChain dataType
import { EvmChain } from '@moralisweb3/common-evm-utils';
import 'dotenv/config'

const app = express();
const port = 3000;

// Add a variable for the api key, address and chain
const chain = EvmChain.POLYGON

const config = {
  apiKey: process.env.ALCHEMY_API,
  network: Network.MATIC_MAINNET,
};
const alchemy = new Alchemy(config);

app.use(cors());
app.use(json())

app.get('/balances/:address', async(req, res) => {
    const { address } = req.params
    try {
        let tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
          address,
          chain,
        });
        let ethBalance = await alchemy.core.getBalance(address, 'latest');
        ethBalance = Utils.formatUnits(ethBalance, 'wei');
        tokenBalances.raw.push({
            token_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            symbol: 'MATIC',
            name: 'MATIC',
            decimals: 18,
            balance: ethBalance,
            possible_spam: false
        })
        tokenBalances.raw.sort((a,b) => a.balance > 0)
        res.send(tokenBalances.raw)
    } catch (e) {
        console.error(e);
    }
})

app.get('/rates/:source/:dest/:amount', async(req, res) => {
  const { source, dest, amount } = req.params
  try {
      let quote = await fetch(
        `https://api.1inch.dev/swap/v5.2/137/quote?src=${source}&dst=${dest}&amount=${amount}&includeTokensInfo=true&includeProtocols=true&includeGas=true`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.ONEINCH_TOKEN}`
          }
        }
      )
      let tokenPricesData = await quote.json()
      res.send(tokenPricesData)
  } catch (e) {
      res.status(400).send('Something broke!')
  }
})

app.get('/checkAllowance', async(req, res) => {
  const { tokenAddress, wallet } = req.query
  try {
      fetch(
        `https://api.1inch.dev/swap/v5.2/137/approve/allowance?tokenAddress=${tokenAddress}&walletAddress=${wallet}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.ONEINCH_TOKEN}`
          }
        }
      )
      .then(res => res.ok ? res.json() : console.log(res))
      .then(data => res.send(data))
      .catch(e => {
        console.log(e)
        res.status(400).send('Something broke!')
      })
  } catch (e) {
      console.log(e)
      res.status(400).send('Something broke!')
  }
})

app.get('/buildAllowanceTx', async(req, res) => {
  const { tokenAddress, amount } = req.query
  try {
      fetch(
        `https://api.1inch.dev/swap/v5.2/137/approve/transaction?tokenAddress=${tokenAddress}&amount=${amount}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.ONEINCH_TOKEN}`
          }
        }
      )
      .then(res => res.ok ? res.json() : console.log(res))
      .then(data => res.send(data))
      .catch(e => {
        console.log(e)
        res.status(400).send('Something broke!')
      })
  } catch (e) {
      console.log(e)
      res.status(400).send('Something broke!')
  }
})

app.get('/buildSwapTx', async(req, res) => {
  const { fromToken, toToken, amount, from, slippage } = req.query
  try {
      let resp = await fetch(
        `https://api.1inch.dev/swap/v5.2/137/swap?src=${fromToken}&dst=${toToken}&amount=${amount}&from=${from}&slippage=${slippage}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.ONEINCH_TOKEN}`
          }
        }
      )
      if(resp.ok){
        let data = await resp.json()
        res.send(data)
      }else{
        res.status(400).send('Something broke!')
      }
  } catch (e) {
      console.log(e)
      res.status(400).send('Something broke!')
  }
})


app.get('/tokenList', async(req, res) => {
    try {
        const response = await fetch('https://api.1inch.dev/token/v1.2/137/token-list?provider=1inch&country=US', {
            headers: {
                'Authorization': `Bearer ${process.env.ONEINCH_TOKEN}`
            }
        })
        const body = await response.json()
        res.send(body)
    } catch (e) {
        console.error(e);
    }
})

const startServer = async () => {
  await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
  // Call startServer()
startServer();