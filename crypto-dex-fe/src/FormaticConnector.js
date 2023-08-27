import { Connector } from 'wagmi'
// import { CoolWalletOptions, CoolWalletProvider } from 'cool-wallet-sdk'
import Fortmatic from 'fortmatic';
import { UserRejectedRequestError } from 'viem';
import { ConnectorNotFoundError } from 'wagmi';

const fm = new Fortmatic('pk_live_6BE607DA8878357F');
export class FormaticConnector extends Connector {
    id = 'formatic'
    name = 'Formatic'
    ready = true
    #provider
    
    constructor(config) {
        super(config)
    }

    async getProvider() {
        if (!this.#provider) {
          this.#provider = fm.getProvider()
        }
        return this.#provider
    }

    async connect() {
       
        try {
            const provider = await this.getProvider()
            if (!provider) throw new ConnectorNotFoundError()
            this.emit('message', { type: 'connecting' })

            let formaticUser = await fm.user.login()
            let account = formaticUser[0]
            
              return {  account, provider }
        } catch (error) {
            if(error.code == -32603)
                throw new UserRejectedRequestError(error)
            throw error
        }
    }

    async disconnect(){
        await fm.user.logout()
    }
    // Implement other methods
    // connect, disconnect, getAccount, etc.
}