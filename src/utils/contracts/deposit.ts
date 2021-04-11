//import { fromRenderProps } from 'recompose';
import { web3 } from '../web3';
import * as AgaveContractABI from '../../abi/agaveLendingABI.json';
import { internalAddresses } from './contractAddresses/internalAddresses';
import { marketData } from '../constants';
import { BigNumber } from '@ethersproject/bignumber';

const deposit = (address: string, amount: Number, referralCode: string, assetName: string) => {
    let targetAsset: any = marketData.find((asset) => {
        return asset.name === assetName
    });
    const contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        let sendAmount = web3.utils.toWei(amount, 'ether')
        contractInstance.methods.deposit(targetAsset.contractAddress, sendAmount, address, referralCode).send({
            from: address
        }, (err: any, res: any) => {
            if (err) reject(err);
            resolve(res);
        })
    })
    
}

export default deposit;