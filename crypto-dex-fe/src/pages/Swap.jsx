import { useEffect, useRef, useState } from 'react'
import '../styles/pages/Swap.css'
import { useAccount, useBalance } from 'wagmi'
import TokenListModal from '../components/SwapPage/TokenListModal'
import { useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify'
import SettingsModal from '../components/SwapPage/SettingsModal'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'
import { getTokensList, getRates, dexSwap, getTokenBalances } from '../api'
import InputContainersWrapper from '../components/InputContainersWrapper'

const ethAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export async function loader(){
    let tokenList = localStorage.getItem('tokenList')
    if(JSON.parse(tokenList) == null ){
        return await getTokensList()
    }
    return JSON.parse(tokenList)
}

export default function Swap(){
    const { isConnected, address } = useAccount()
    const tokenList = useLoaderData()
    const [fromToken, setFromToken] = useState(tokenList.filter(item => item.name == "MATIC")[0])
    const [toToken, setToToken] = useState(tokenList.filter(item => item.symbol == "USDT")[0])
    const [isTokenListModalOpen, setIsTokenListModalOpen] = useState(false)
    const [tokenListModalDir, setTokenListModalDir] = useState('')
    const [fromAmount, setFromAmount] = useState('')
    const [toAmount, setToAmount] = useState('')
    const [userBalances, setUserBalances] = useState(null)
    const [txSettings, setTxSettings] = useState({slippage: '1', deadline: ''})
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isBalancesLoading, setIsBalancingLoading] = useState(null)
    const [isRatesLoading, setIsRatesLoading] = useState(false)
    const [isTxBuilding, setIsTxBuilding] = useState(false)
    const [txDetails, setTxDetails] = useState({
        to: null,
        data: null,
        value: null
    })

    const {data, sendTransaction} = useSendTransaction({
        from: address,
        to: String(txDetails.to),
        data: String(txDetails.data),
        value: String(txDetails.value)
    })

    const {isLoading, isSuccess} = useWaitForTransaction({
        hash: data?.hash
    })

    const toastId = useRef(null);
    const notific = () => toastId.current = toast("Transaction pending...", { position: "top-center", autoClose: false });
    const update = () => toast.update(toastId.current, { render: "Transaction successfull!", type: toast.TYPE.SUCCESS, autoClose: 5000 });

    useEffect(()=>{
        if(isLoading)
            notific()
        if(isSuccess)
            update()
    }, [isLoading, isSuccess])

    const notify = () => toast.info("Please select different tokens", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
    const notifyError = () => toast.error("Something went wrong. Please try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
    
    const fromTokenData = useBalance({
        address: address,
        token: fromToken.address == ethAddress ? null : fromToken.address
    })
    const toTokenData = useBalance({
        address: address,
        token: toToken.address == ethAddress ? null : toToken.address
    })

    useEffect(()=>{
        if(fromAmount == '' || parseFloat(fromAmount) == 0) {
            return setToAmount('')
        }
        setIsRatesLoading(true)
        let getTokenRates = setTimeout(async()=>{
            let weiAmount = parseFloat(fromAmount) * Math.pow(10, fromToken.decimals)
            try {
                setToAmount(await getRates(fromToken.address, toToken.address, weiAmount))
                
            }catch(e){
                console.log(e)
                notifyError()
                return setFromAmount('')
            }finally {
                setIsRatesLoading(false)
            }
        }, 500)

        return ()=> clearTimeout(getTokenRates)
    }, [fromAmount, toToken, fromToken])
    
    useEffect(()=>{
        localStorage.setItem('tokenList', JSON.stringify(tokenList))
    }, [])

    useEffect(()=>{
        setIsTokenListModalOpen(false)
    }, [fromToken, toToken])

    useEffect(()=>{
        if(address)
            getUserBalances()
        else setUserBalances(null)
    },[address])

    useEffect(()=>{
        if(txDetails.to && isConnected){
            sendTransaction()
        }
    }, [txDetails])
    
    async function fetchDexSwap(){
        setIsTxBuilding(true)
        try {
            let txData = await dexSwap(fromToken, fromAmount, toToken, address, txSettings.slippage)
            setTxDetails(txData?.tx ? txData.tx : txData)
        }catch(e){
            notifyError()
            console.log(e)
        }finally{
            setIsTxBuilding(false)
        }
    }

    async function getUserBalances(){
        setIsBalancingLoading(true)
        try {
            let balances = await getTokenBalances(address)
            let finalBalances = {}
            balances.map(item => finalBalances[item.token_address] = {balance: item.balance, decimals: item.decimals})
            setUserBalances(finalBalances)
        }catch(e){
            notifyError()
            console.log(e)
        }finally{
            setIsBalancingLoading(false)
        }
    }

    function toggleIsTokenListModalOpen(direction){
        setTokenListModalDir(direction)
        setIsTokenListModalOpen(prev => !prev)
    }

    function toggleIsSettingsOpen(){
        setIsSettingsOpen(prev => !prev)
    }


    function handleChange(e){
        setFromAmount(e.target.value)
    }

    function handleTokenSelect(token, direction){
        if(direction == 'from' && toToken.address == token.address){
            setIsTokenListModalOpen(prev => !prev)
            notify()
            return
        }
        if(direction == 'to' && fromToken.address == token.address){
            setIsTokenListModalOpen(prev => !prev)
            notify()
            return
        }
        if(direction == 'from'){
            setFromToken(token)
        } else setToToken(token)
        setIsTokenListModalOpen(prev => !prev)
    }

    function switchTokens(){
        if(toAmount != '')
            setFromAmount(toAmount)
        let token = fromToken
        setFromToken(toToken)
        setToToken(token)
    }

    function setMaxFromAmount(){
        setFromAmount(Math.floor(fromTokenData.data.formatted * 10000) / 10000)
    }

    return (
        <>
        <main>
            <div className="swap-container main-container">
                <div className="swap-container-header main-container-header">
                    <h1 className="title">Swap</h1>
                    <img className="setttings-btn" src="icon-settings.svg" alt="Settings button" onClick={toggleIsSettingsOpen}></img>
                </div>
                {isSettingsOpen && <SettingsModal txSettings={txSettings} setTxSettings={setTxSettings} toggleIsSettingsOpen={toggleIsSettingsOpen}/>}
                <div className="input-containers">
                    <InputContainersWrapper 
                        userBalances={userBalances}
                        setMaxFromAmount={setMaxFromAmount}
                        handleChange={handleChange}
                        toggleIsTokenListModalOpen={toggleIsTokenListModalOpen}
                        fromAmount={fromAmount}
                        fromToken={fromToken}
                        fromTokenData={fromTokenData}
                        toAmount={toAmount}
                        toToken={toToken}
                        toTokenData={toTokenData}
                        isRatesLoading={isRatesLoading }
                    />
                    <button className="switch-currencies-btn" disabled={isRatesLoading} onClick={switchTokens}><img className="arrows" alt='Exchange currencies' src='icon-swap.svg' /></button>
                </div>
                <div className="slippage-info">
                    <p className="slippage-text">Slippage Tolerance</p>
                    <p className="slippage-value">{txSettings.slippage || '1'}%</p>
                </div>
                <button className='swap-btn' onClick={fetchDexSwap} disabled={!fromAmount || parseFloat(fromAmount) == 0 || !isConnected || isRatesLoading || fromTokenData.data && parseFloat(fromAmount) > parseFloat(fromTokenData.data?.formatted) || isLoading || isTxBuilding}>{!fromAmount && 'Enter A Mount' || !isConnected && "Connect Wallet" || "Swap"}</button>
            </div>
        </main>
        {isTokenListModalOpen && <TokenListModal 
            toggle={toggleIsTokenListModalOpen} 
            tokenList={tokenList} 
            direction={tokenListModalDir} 
            setToken={handleTokenSelect} 
            userBalances={userBalances}
            isBalancesLoading={isBalancesLoading}
        />}
        {isTxBuilding && <div className="loading-modal">Building Transaction...</div>}
        
        </>
    )
}