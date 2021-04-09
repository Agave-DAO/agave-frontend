import daiImg from '../assets/image/coins/dai.svg';
import ethImg from '../assets/image/coins/eth.svg';
import agaveImg from '../assets/image/coins/agave.png';
import honeyImg from '../assets/image/coins/honey.svg';
import wbtcImg from '../assets/image/coins/wbtc.svg';
import getBalance from './contracts/getBalance';

const addresses: Readonly<Record<string, string>> = {
  Agave: "0xaE88624C894668E1bBABc9AFE87E8CA0fb74eC2a",
  wETH: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  HNY: "0xa30CCf67b489d627De8F8c035F5b9676442646e0",
  wBTC: "0x64Ed1291Fe07AdE7BB261c7AA8491e4bc0E8DE1c",
  DAI: "0x569AafF8F90A5E48B27C154249eE5A08eD0C44E2"
}

export interface IMarketData {
  name: string,
  img: string,
  market_size: number,
  liquidity: number,
  total_borrowed: number,
  deposit_apy: number,
  variable_borrow_apr: number,
  stable_borrow_apr: number,
  asset_price: number,
  wallet_balance: number,
  supply_balance: number,
  borrow_balance: number,
  collateral: boolean,
  isVariable: boolean,
  contractAddress: string,
}

export const marketData: ReadonlyArray<IMarketData> = [
  {
    name: 'DAI',
    img: daiImg,
    market_size: 14300,
    liquidity: 12000,
    total_borrowed: 2300,
    deposit_apy: 0.03,
    variable_borrow_apr: 0.43,
    stable_borrow_apr: 9.21,
    asset_price: 1,
    wallet_balance: 8000,
    supply_balance: 2000,
    borrow_balance: 320,
    collateral: true,
    isVariable: true,
    contractAddress: addresses.DAI
  },
  {
    name: 'AG',
    img: agaveImg,
    market_size: 32000,
    liquidity: 27200,
    total_borrowed: 4800,
    deposit_apy: 1.63,
    variable_borrow_apr: 2.27,
    stable_borrow_apr: 7.32,
    asset_price: 1,
    wallet_balance: 4000,
    supply_balance: 4500,
    borrow_balance: 500,
    collateral: false,
    isVariable: false,
    contractAddress: addresses.Agave
  },
  {
    name: 'HNY',
    img: honeyImg,
    market_size: 9800,
    liquidity: 6600,
    total_borrowed: 3200,
    deposit_apy: 0.02,
    variable_borrow_apr: 0.04,
    stable_borrow_apr: 5.02,
    asset_price: 1,
    wallet_balance: 9000,
    supply_balance: 7200,
    borrow_balance: 0,
    collateral: true,
    isVariable: true,
    contractAddress: addresses.HNY
  },
  {
    name: 'wBTC',
    img: wbtcImg,
    market_size: 6420,
    liquidity: 5120,
    total_borrowed: 1300,
    deposit_apy: 0.95,
    variable_borrow_apr: 4.31,
    stable_borrow_apr: 9.15,
    asset_price: 0.24,
    wallet_balance: 3208,
    supply_balance: 6200,
    borrow_balance: 200,
    collateral: true,
    isVariable: true,
    contractAddress: addresses.wBTC
  },
  {
    name: 'ETH',
    img: ethImg,
    market_size: 3600,
    liquidity: 2100,
    total_borrowed: 1500,
    deposit_apy: 93.27,
    variable_borrow_apr: 105.15,
    stable_borrow_apr: 107.15,
    asset_price: 1157.39,
    wallet_balance: 2340,
    supply_balance: 7800,
    borrow_balance: 450,
    collateral: false,
    isVariable: false,
    contractAddress: addresses.wETH
  }
];

export const updateBalance = (address: string) => {
  marketData.forEach(async(asset) => {
    let balance = await getBalance(address, asset.name);
    asset.wallet_balance = balance;
  });
};
