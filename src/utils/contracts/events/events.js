import { web3 } from '../../web3';
import { ContractABI } from '../abi/erc20abi';
import { AgaveContractABI } from '../abi/agaveLendingABI';
import { externalAddresses } from '../contractAddresses/externalAdresses';
import { internalAddresses } from '../contractAddresses/internalAddresses';
import { marketData } from '../../constants';

export const approveSpendListener = async (address, assetName, hash) => {
    let targetAsset = marketData.find((asset) => {
        return asset.name === assetName
    });
    let contractInstance = new web3.eth.Contract(ContractABI, targetAsset.contractAddress);
    return new Promise(async(resolve, reject) => {
        contractInstance.events.Approval({
            filter:{
                owner: address
            },
            fromBlock: await web3.eth.getBlockNumber()
        }, (err,event) => {
            if (err) throw reject(err);
            if (hash === event.transactionHash){
                resolve(true);
            }
        })
    })
    
}

export const depositListener = async (hash) => {
    let contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        contractInstance.events.Deposit((err, event) => {
            if (err) reject(err);
            if (hash === event.transactionHash){
                resolve({status: true, ...event})
            }
        })
    })
}
export const withdrawListener = async (hash) => {
    let contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        contractInstance.events.Withdraw((err, event) => {
            if (err) reject(err);
            if (hash === event.transactionHash){
                resolve({status: true, ...event})
            }
        })
    })
}
export const reserveListner = async (hash) => {
    let contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        contractInstance.events.ReserveUsedAsCollateralEnabled((err, event) => {
            if (err) reject(err);
            if (hash === event.transactionHash){
                resolve({status: true, ...event})
            }
        })
    })
}
export const borrowListener = async (hash) => {
    let contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        contractInstance.events.Borrow((err, event) => {
            if (err) reject(err);
            if (hash === event.transactionHash){
                resolve({status: true, ...event})
            }
        })
    })
}
export const repayListener = async (hash) => {
    let contractInstance = new web3.eth.Contract(AgaveContractABI, internalAddresses.Lending);
    return new Promise((resolve, reject) => {
        contractInstance.events.Repay((err, event) => {
            if (err) reject(err);
            if (hash === event.transactionHash){
                resolve({status: true, ...event})
            }
        })
    })
}