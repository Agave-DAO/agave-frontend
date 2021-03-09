import { web3 } from '../web3';
import { ContractABI } from './abi/erc20abi';
import { externalAddresses } from './contractAddresses/externalAdresses';
import { internalAddresses } from './contractAddresses/internalAddresses';

export const approve = (address, assetName, balance) => {
    const contractInstance = new web3.eth.Contract(ContractABI, externalAddresses[assetName]);
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
    const contractInstance = new web3.eth.Contract(ContractABI, externalAddresses[assetName]);
    return new Promise((resolve, reject) => {
        contractInstance.methods.allowance(address, internalAddresses.Lending).call({
            from: address
        }, (err, res) => {
            if (err) reject(err);
            resolve(res)
        })
    })
}