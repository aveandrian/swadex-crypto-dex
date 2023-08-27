import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Swap from './pages/Swap.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from '@wagmi/core/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { CoinbaseWalletConnector } from "@wagmi/connectors/coinbaseWallet"
import { FormaticConnector } from './FormaticConnector.js'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { loader as SwapLoader } from './pages/Swap.jsx'
import {  polygon } from '@wagmi/core/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import '@rainbow-me/rainbowkit/styles.css';

const { chains, publicClient } = configureChains(
  [polygon],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }),
    publicProvider()
  ],
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector(),
    new WalletConnectConnector({
      chains,
      options: {
        projectId:  import.meta.env.VITE_WC_PROJECT_ID,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Swadex",
      },
    }),
    new FormaticConnector({
      chains
    }),
    new InjectedConnector({ chains })
  ],
  publicClient
})


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Swap />,
        loader: SwapLoader
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
