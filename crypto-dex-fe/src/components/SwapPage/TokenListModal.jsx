import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose, faPen } from "@fortawesome/free-solid-svg-icons"
import { useState, useRef } from "react"
import { useAccount } from "wagmi";
import { ViewportList } from 'react-viewport-list';
import '../../styles/components/SwapPage/TokenListModal.css'

export default function TokenListModal({toggle, tokenList, direction, setToken, userBalances, isBalancesLoading}){
    const ref = useRef(null);
    const [searchValue, setSearchValue] = useState('')
    const { address } = useAccount()

    function handleChange(e){
        setSearchValue(e.target.value)
    }

    function handleImgError(e){
        e.target.src = 'vite.svg'
    }

    return (
        <div className='token-list-modal' ref={ref}>
            <div className='token-list-wrapper'> 
                <div className="connect-wallet-header">
                    <p>Select a token</p>
                    <FontAwesomeIcon className="close-icon" icon={faClose} onClick={()=>toggle(direction)}/>
                </div>
                <div className='token-list-modal-header'>
                    <input 
                        className='token-list-modal-search' 
                        type='text' 
                        placeholder='Search name or paste address'
                        value={searchValue}
                        onChange={handleChange}
                    />
                </div>
                {
                    isBalancesLoading && address 
                    ? <p>Loading balances...</p>
                    : <ViewportList 
                    viewportRef={ref}  
                    items={tokenList.filter(item => item.address.toLowerCase().startsWith(searchValue.toLowerCase()) || item.symbol.toLowerCase().startsWith(searchValue.toLowerCase()))}>
                    {token => (
                       <div key={token.address} className='token-list-modal-token' onClick={()=>setToken(token, direction)}>
                           <img loading="lazy" className='token-logo' src={token.logoURI} onError={handleImgError}/>
                           <p>{token.symbol}</p>
                           <div className='token-list-modal-token-balance'>
                               <p>{userBalances && userBalances[token.address] ? parseFloat(userBalances[token.address].balance / Math.pow(10, userBalances[token.address].decimals)).toFixed(4) : "0.00"}</p>
                               <p>{token.name}</p>
                           </div>
                       </div>
                    )}
                    </ViewportList>
                    

                }
                
                <div className='manage-btn'><FontAwesomeIcon icon={faPen} />Manage</div>
            </div>
            
        </div>
    )
}