import { web3 } from '../web3';
import { AgaveContractABI } from './abi/agaveLendingABI';
import { internalAddresses } from './contractAddresses/internalAddresses';
import { externalAddresses } from './contractAddresses/externalAdresses';

const repay = (address, amount, assetName) => {
    const contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        let repayAmount = web3.utils.toWei(amount, 'ether')
        contractInstance.methods.repay(externalAddresses[assetName], repayAmount, 2, address).send({
            from: address
        }, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
    
}

export default repay;