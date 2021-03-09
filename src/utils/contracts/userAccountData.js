import { web3 } from '../web3';
import { AgaveContractABI } from './abi/agaveLendingABI';
import { internalAddresses } from './contractAddresses/internalAddresses';
import { externalAddresses } from './contractAddresses/externalAdresses';

const userAccount = (address) => {
    const contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        contractInstance.methods.getUserAccountData(address).call({
            from: address
        }, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
    
}

export default userAccount;