import { web3 } from '../web3';
import { ContractABI } from './abi/erc20abi';
import { marketData } from '../constants';
import { internalAddresses } from './contractAddresses/internalAddresses';

export const approve = (address, assetName, balance) => {
    
    let targetAsset = marketData.find((asset) => {
        return asset.name === assetName
    });
    const contractInstance = new web3.eth.Contract(ContractABI, targetAsset.contractAddress);
    return new Promise((resolve, reject) => {
        balance = web3.utils.toWei(balance, 'ether');
        contractInstance.methods.approve(internalAddresses.Lending, balance).send({
            from: address
        }, (err, res) => {
            if (err) reject(err);
            resolve(res)
        })
    })
}

export const checkApproved = (address, assetName) => {
    let targetAsset = marketData.find((asset) => {
        return asset.name === assetName
    });
    const contractInstance = new web3.eth.Contract(ContractABI, targetAsset.contractAddress);
    return new Promise((resolve, reject) => {
        contractInstance.methods.allowance(address, internalAddresses.Lending).call({
            from: address
        }, (err, res) => {
            if (err) reject(err);
            resolve(res)
        })
    })
}