import { web3 } from '../web3';
import * as AgaveContractABI from '../../abi/agaveLendingABI.json';
import { internalAddresses } from './contractAddresses/internalAddresses';
import { externalAddresses } from './contractAddresses/externalAdresses';

const userConfig = (address: string) => {
    const contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        contractInstance.methods.getUserConfiguration(address).call({
            from: address
        }, (err: any, res: any) => {
            if (err) reject(err);
            resolve(res);
        })
    })
    
}

export default userConfig;