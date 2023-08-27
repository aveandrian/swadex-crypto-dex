import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"


export default function InputContainersWrapper({userBalances, setMaxFromAmount, fromAmount, handleChange, toggleIsTokenListModalOpen, fromTokenData, fromToken, toAmount, toToken, toTokenData, isApiLoading}){
    function handleImgError(e){
        e.target.src = 'vite.svg'
    }

    return (
        <>
        <div className="input-container from">
            <div className="input-container-header">
                <p className="input-title">From</p>
                <button className="max-btn" disabled={!userBalances} onClick={setMaxFromAmount}>Use Max</button>
            </div>
            <div className="amount-container">
                <input type="number" className="amount-input" placeholder='0' value={fromAmount} onChange={handleChange} name="fromAmount"/>
                <div className="currency-dropdown" onClick={()=>toggleIsTokenListModalOpen('from')}>
                    <img className="curency-icon" src={fromToken.logoURI} onError={handleImgError}/>
                    <p  className="currency-name">{fromToken.symbol}</p>
                    <FontAwesomeIcon icon={faChevronDown} className="checvron-down"/>
                </div>
            </div>
            <div className="input-container-footer main-container-footer">
                <p className="balance">Balance: {fromTokenData.data ? `~${parseFloat(fromTokenData.data.formatted).toFixed(4)}` : "0.00"}</p>
            </div>
        </div>
        <div className="input-container to">
            <div className="input-container-header">
                <p className="input-title">To</p>
            </div>
            <div className="amount-container">
                {isApiLoading 
                ? <div className="amount-input loading" >Getting rates...</div> 
                : <input type="text" className="amount-input"  placeholder='0' disabled={true} value={toAmount}  name="toAmount" />}
                <div className="currency-dropdown" onClick={()=>toggleIsTokenListModalOpen('to')}>
                    <img className="curency-icon" src={toToken.logoURI} onError={handleImgError}/>
                    <p  className="currency-name">{toToken.symbol}</p>
                    <FontAwesomeIcon icon={faChevronDown} className="checvron-down"/>
                </div>
            </div>
            <div className="input-container-footer">
                <p className="balance">Balance: {toTokenData.data ? parseFloat(toTokenData.data.formatted).toFixed(4) : "0.00"}</p>
            </div>
        </div>
        </>
    )
}