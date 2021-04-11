import { web3 } from '../web3';
import * as AgaveContractABI from '../../abi/agaveLendingABI.json';
import { internalAddresses } from './contractAddresses/internalAddresses';
import { marketData } from '../constants';

const reserveData = (address: string, assetName: string) => {
    let targetAsset: any = marketData.find((asset) => {
        return asset.name === assetName
    });
    const contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        contractInstance.methods.getReserveData(targetAsset.contractAddress).call({
            from: address
        }, (err: any, res: any) => {
            if (err) reject(err);
            resolve(res);
        })
    })
    
}

export default reserveData;