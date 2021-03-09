import { web3 } from '../web3';
import { ContractABI } from './abi/erc20abi';
import { externalAddresses } from './contractAddresses/externalAdresses';
import { internalAddresses } from './contractAddresses/internalAddresses';

const getBalance = async (address, assetName, task) => {
    let contractInstance;
    console.log(externalAddresses[assetName])
    if(externalAddresses[assetName]){
        const contractInstance = new web3.eth.Contract(ContractABI, task === 'withdraw' || task === 'borrow' ? internalAddresses.assets[assetName] : externalAddresses[assetName] );
        return new Promise((resolve, reject) => {
            contractInstance.methods.balanceOf(address).call({ from: address }, (err, res) => {
                if (err) reject(err);
                let balance = web3.utils.fromWei(res, 'ether');
                resolve(balance)
            });
        })
    }
    
}

export default getBalance;