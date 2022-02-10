import wxdaiImg from "../assets/image/coins/wxdai.svg";
import ethImg from "../assets/image/coins/eth.svg";
import agaveImg from "../assets/image/coins/agave.webp";
import honeyImg from "../assets/image/coins/honey.webp";
import wbtcImg from "../assets/image/coins/wbtc.svg";
import usdcImg from "../assets/image/coins/usdc.svg";
import { theme } from "@chakra-ui/theme";
import { BigNumber, constants } from "ethers";
export const LINEAR_GRADIENT_BG =
  "linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%)";

export const spacings = {
  md: "1.3rem",
};

export const MIN_SAFE_HEALTH_FACTOR = BigNumber.from(1200);
export const MINIMUM_NATIVE_RESERVE = constants.WeiPerEther.div(50);
export const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);
export const MAX_INT256 = BigNumber.from(2).pow(255).sub(1);

export const assetColor: { [key: string]: string } = {
  USDC: theme.colors.cyan[400],
  XDAI: theme.colors.orange[300],
  WXDAI: theme.colors.orange[300],
  WETH: theme.colors.gray[100],
  AGVE: theme.colors.green[400],
  HNY: theme.colors.yellow[400],
  WBTC: theme.colors.orange[500],
  STAKE: theme.colors.teal[400],
  USDT: theme.colors.green[600],
  LINK: theme.colors.blue[500],
  GNO: theme.colors.gray[700],
  FOX: theme.colors.blue[900],
};

export const fontSizes = {
  md: "1.4rem",
  sm: "1.2rem",
  xs: "1rem",
  lg: "1.6rem",
  xl: "1.8rem",
  "2xl": "2rem",
  xxl: "2rem",
};

const addresses: Readonly<Record<string, string>> = {
  Agave: "0xaE88624C894668E1bBABc9AFE87E8CA0fb74eC2a",
  wETH: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  HNY: "0xa30CCf67b489d627De8F8c035F5b9676442646e0",
  wBTC: "0x64Ed1291Fe07AdE7BB261c7AA8491e4bc0E8DE1c",
  wxDAI: "0x569AafF8F90A5E48B27C154249eE5A08eD0C44E2",
};

export const imagesBySymbol: Record<string, string | undefined> = {
  AGVE: agaveImg,
  WETH: ethImg,
  HNY: honeyImg,
  WBTC: wbtcImg,
  USDC: usdcImg,
  WXDAI: wxdaiImg,
};

export interface IMarketData {
  name: string;
  img: string;
  market_size: number;
  liquidity: number;
  total_borrowed: number;
  deposit_apy: number;
  variable_borrow_apr: number;
  stable_borrow_apr: number;
  asset_price: number;
  wallet_balance: number;
  supply_balance: number;
  borrow_balance: number;
  collateral: boolean;
  isVariable: boolean;
  contractAddress: string;
}

export interface IMarketDataTable {
  name: string;
  img: string;
  wallet_balance: number;
  deposit_apy: number;
}

export const marketData: ReadonlyArray<IMarketData> = [
  {
    name: "WXDAI",
    img: wxdaiImg,
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
    contractAddress: addresses.DAI,
  },
  {
    name: "AG",
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
    contractAddress: addresses.Agave,
  },
  {
    name: "HNY",
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
    contractAddress: addresses.HNY,
  },
  {
    name: "wBTC",
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
    contractAddress: addresses.wBTC,
  },
  {
    name: "ETH",
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
    contractAddress: addresses.wETH,
  },
];
