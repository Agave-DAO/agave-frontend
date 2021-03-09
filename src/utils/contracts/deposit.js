import { web3 } from '../web3';
import { AgaveContractABI } from './abi/agaveLendingABI';
import { internalAddresses } from './contractAddresses/internalAddresses';
import { externalAddresses } from './contractAddresses/externalAdresses';

const deposit = (address, amount, referralCode, assetName) => {
    const contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        let sendAmount = web3.utils.toWei(amount, 'ether')
        contractInstance.methods.deposit(externalAddresses[assetName], sendAmount, address, referralCode).send({
            from: address
        }, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
    
}

export default deposit;