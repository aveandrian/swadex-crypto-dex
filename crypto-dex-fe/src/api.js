const delay = ms => new Promise(res => setTimeout(res, ms));

export async function getTokensList(){
    let res = await fetch('http://localhost:3000/tokenList')
    let data = await res.json()
    return data.tokens
}

export async function getRates(fromAddress, toAddress, weiAmount){
    let res = await fetch(`http://localhost:3000/rates/${fromAddress}/${toAddress}/${weiAmount}`)
    let rates = await res.json()
    let toAmount = rates.toAmount / Math.pow(10, rates.toToken.decimals)
    return parseFloat(toAmount).toFixed(4)
}

export async function dexSwap(fromToken, fromAmount, toToken, wallet, slippage){
    try {
        let checkAllowanceRes = await fetch(`http://localhost:3000/checkAllowance?tokenAddress=${fromToken.address}&wallet=${wallet}`)
        let data = await checkAllowanceRes.json()
        if(parseFloat(data.allowance) / Math.pow(10, fromToken.decimals) < parseFloat(fromAmount)){
            console.log("Need more allowance")
            await delay(2000)
            let amountInWei = parseFloat(fromAmount) * Math.pow(10, fromToken.decimals)
            let txForApprovalRes = await fetch(`http://localhost:3000/buildAllowanceTx?tokenAddress=${fromToken.address}&amount=${amountInWei}`)
            let txForApprovalData = await txForApprovalRes.json()
            return txForApprovalData
        }
        console.log("Swapping!")
        await delay(2000)
        let amountInWei = parseFloat(fromAmount) * Math.pow(10, fromToken.decimals)
        let txSwapRes = await fetch(`http://localhost:3000/buildSwapTx?fromToken=${fromToken.address}&toToken=${toToken.address}&amount=${amountInWei}&from=${wallet}&slippage=${slippage}`)
        let txSwapData = await txSwapRes.json()
        return txSwapData
    }catch(e){
        console.log(e)
        throw Error(e.message)
    }
}

export async function getTokenBalances(address){
    let res = await fetch(`http://localhost:3000/balances/${address}`)
    return await res.json()
}