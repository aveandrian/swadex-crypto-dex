import '../../styles/components/SwapPage/SettingsModal.css'

export default function SettingsModal({txSettings, setTxSettings, toggleIsSettingsOpen}){
    function handleChange(e){
        let name = e.target.getAttribute('name')
        let value = e.target.getAttribute('value') || e.target.value
        setTxSettings(prev => ({...prev, [name]: value}))
        if (e.target.classList.contains('radio'))
            toggleIsSettingsOpen()
    }

    function handleSubmit(e){
        e.preventDefault()
        toggleIsSettingsOpen()
    }
    return (
        <form className='swap-settings-form' onSubmit={handleSubmit}> 
            <h3 className="swap-settings-title">Transaction Setting</h3>
            <div className="slippage-setting-container">
                <p className="slippage-setting-title">Slippage tolerance</p>
                <div className="slippage-setting-options">
                    <div className="slippage-option radio" name="slippage" value={0.1} onClick={handleChange}>0.1%</div>
                    <div className="slippage-option radio" name="slippage" value={0.5} onClick={handleChange}>0.5%</div>
                    <div className="slippage-option radio" name="slippage" value={1}   onClick={handleChange}>1%</div>
                    <input type="number" min={0.00} max={50.00} step="0.01" className="slippage-option custom" name="slippage" placeholder="1.00%" value={txSettings.slippageInput} onChange={handleChange} />
                </div>
            </div>
            <div className="deadline-setting-container">
                <p className="deadline-setting-title">Transaction deadline</p>
                <div className="deadline-setting-input-container">
                    <input type="number" className="deadline-setting-input" name="deadline" placeholder="20" value={txSettings.deadlineInput} onChange={handleChange} />
                    <p className="deadline-setting-input-label">minutes</p>
                </div>
            </div>
            <button type="submit" style={{display: 'none'}}></button>
        </form>
    )
}