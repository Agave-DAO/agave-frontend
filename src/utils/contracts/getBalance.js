import { web3 } from '../web3';
import { ContractABI } from './abi/erc20abi';
import { marketData } from '../constants';

const getBalance = async (address, assetName, aToken) => {
    let targetAsset = marketData.find((asset) => {
        return asset.name === assetName
    });
    if (targetAsset.contractAddress) {
        const contractInstance = new web3.eth.Contract(ContractABI, (aToken === undefined) ? targetAsset.contractAddress : aToken);
        return new Promise((resolve, reject) => {
            contractInstance.methods.balanceOf(address).call({ from: address }, (err, res) => {
                if (err) reject(err);
                let balance = parseInt(web3.utils.fromWei(res, 'ether')).toFixed(4);
                resolve(balance)
            });
        })
    }

}

export default getBalance;