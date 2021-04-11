import { web3 } from '../web3';
import * as ContractABI from '../../abi/erc20abi.json';
import { marketData } from '../constants';

const getBalance = async (address: string, assetName: string, aToken: string) => {
    let targetAsset: any = marketData.find((asset) => {
        return asset.name === assetName
    });
    if (targetAsset.contractAddress) {
        const contractInstance = new web3.eth.Contract(ContractABI, (aToken === undefined) ? targetAsset.contractAddress : aToken);
        return new Promise((resolve, reject) => {
            contractInstance.methods.balanceOf(address).call({ from: address }, (err: any, res: any) => {
                if (err) reject(err);
                let balance = parseInt(web3.utils.fromWei(res, 'ether')).toFixed(4);
                resolve(balance)
            });
        })
    }

}

export default getBalance;