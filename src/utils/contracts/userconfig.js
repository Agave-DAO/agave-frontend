import { web3 } from '../web3';
import { AgaveContractABI } from './abi/agaveLendingABI';
import { internalAddresses } from './contractAddresses/internalAddresses';
import { externalAddresses } from './contractAddresses/externalAdresses';

const userConfig = (address) => {
    const contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        contractInstance.methods.getUserConfiguration(address).call({
            from: address
        }, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
    
}

export default userConfig;