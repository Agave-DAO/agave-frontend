import { web3 } from '../web3';
import * as ContractABI from '../../abi/erc20abi.json';
import { marketData } from '../constants';
import { internalAddresses } from './contractAddresses/internalAddresses';

export const approve = (address: string, assetName: string, balance: string) => {
    
    let targetAsset: any = marketData.find((asset) => {
        return asset.name === assetName
    });
    const contractInstance = new web3.eth.Contract(ContractABI, targetAsset.contractAddress);
    return new Promise((resolve, reject) => {
        balance = web3.utils.toWei(balance, 'ether');
        contractInstance.methods.approve(internalAddresses.Lending, balance).send({
            from: address
        }, (err: any, res: any) => {
            if (err) reject(err);
            resolve(res)
        })
    })
}

export const checkApproved = (address: string, assetName: string) => {
    let targetAsset: any = marketData.find((asset) => {
        return asset.name === assetName
    });
    const contractInstance = new web3.eth.Contract(ContractABI, targetAsset.contractAddress);
    return new Promise((resolve, reject) => {
        contractInstance.methods.allowance(address, internalAddresses.Lending).call({
            from: address
        }, (err: any, res: any) => {
            if (err) reject(err);
            resolve(res)
        })
    })
}