export interface StrongTypedChainAddresses<
  Id extends ValidNetworkIdTypes,
  Name extends ValidNetworkNameTypes
> {
  readonly chainId: Id;
  readonly chainName: Name;
  readonly symbol: string;
  readonly lendingPool: string;
  readonly staking: string;

  readonly agaveOracle: string;
  readonly aaveProtocolDataProvider: string;
  readonly wrappedNativeGateway: string;
  readonly walletBalanceProvider: string;

  readonly incentivesController: string;

  readonly explorer?: string | undefined;
  readonly rpcUrl?: string | undefined;

  readonly USDC: string | undefined;
  readonly WXDAI: string | undefined;
  readonly LINK: string | undefined;
  readonly GNO: string | undefined;
  readonly FOX: string | undefined;
  readonly USDT: string | undefined;
  readonly WETH: string | undefined;
  readonly WBTC: string | undefined;

  readonly agUSDC: string | undefined;
  readonly agWXDAI: string | undefined;
  readonly agLINK: string | undefined;
  readonly agGNO: string | undefined;
  readonly agFOX: string | undefined;
  readonly agUSDT: string | undefined;
  readonly agWETH: string | undefined;
  readonly agWBTC: string | undefined;

  readonly cagUSDC: string | undefined;
  readonly cagWXDAI: string | undefined;
  readonly cagGNO: string | undefined;
  readonly cagWBTC: string | undefined;
  readonly cagWETH: string | undefined;
  readonly cagUSDT: string | undefined;

}

export interface ChainAddresses extends StrongTypedChainAddresses<any, any> {
  readonly chainId: number;
  readonly chainName: string;
}

export const ValidNetworkNames = ["rinkeby", "Gnosis"] as const;
export type ValidNetworkNameTypes = typeof ValidNetworkNames[number];

export const ValidNetworkIds = {
  rinkeby: 4,
  Gnosis: 100,
} as const;
export type ValidNetworkIdTypes = typeof ValidNetworkIds[ValidNetworkNameTypes];

export const internalAddressesPerNetwork: Record<
  ValidNetworkNameTypes,
  StrongTypedChainAddresses<ValidNetworkIdTypes, ValidNetworkNameTypes>
> = {
  rinkeby: {
    chainName: "rinkeby",
    chainId: 4,
    symbol: "XDAI", // Specific to our deployment!

    lendingPool: "0x1E6A0Ae721ee7598B7FA53Ea91A93313b729e2A9",
    staking: "0xdefd31e8c8e5e7db1d2e2204c99d006e1607554b",

    agaveOracle: "0xf1771FEcA72fbC347AD78f2B9D766EB7d97d4310",
    aaveProtocolDataProvider: "0xb423A3A2b52E60e3e34968Dad6ed788e2575cd71",
    wrappedNativeGateway: "0x8149c8E0F3561A89E343853a7f20A985374dca62",
    walletBalanceProvider: "",
    incentivesController: "",

    explorer: "https://rinkeby.etherscan.io",

    USDC: "",
    WXDAI: "",
    LINK: "",
    GNO: "",
    FOX: "",
    USDT: "",
    WETH: "",
    WBTC: "",   

    agUSDC: "",
    agWXDAI: "",
    agLINK: "",
    agGNO: "",
    agFOX: "",
    agUSDT: "",
    agWETH: "",
    agWBTC: "",

    cagUSDC: "",
    cagWXDAI: "",
    cagGNO: "",
    cagWBTC: "",
    cagWETH: "",
    cagUSDT: "",

  },
  Gnosis: {
    chainName: "Gnosis",
    chainId: 100,
    symbol: "XDAI",

    lendingPool: "0x5E15d5E33d318dCEd84Bfe3F4EACe07909bE6d9c",
    staking: "0x610525b415c1BFAeAB1a3fc3d85D87b92f048221",

    agaveOracle: "0x64cE22B5bA4175002AC5B6CCE3570432cA363c29",
    aaveProtocolDataProvider: "0x24dCbd376Db23e4771375092344f5CbEA3541FC0",
    walletBalanceProvider: "0xc83259C1A02d7105A400706c3e1aDc054C5A1B87",
    wrappedNativeGateway: "0x36A644cC38Ae257136EEca5919800f364d73FeFC",

    incentivesController: "0xfa255f5104f129B78f477e9a6D050a02f31A5D86",

    explorer: "https://gnosisscan.io/",
    rpcUrl: "https://gnosischain-rpc.gateway.pokt.network",

    USDC: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
    WXDAI: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
    LINK: "0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2",
    GNO: "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb",
    FOX: "0x21a42669643f45Bc0e086b8Fc2ed70c23D67509d",
    USDT: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
    WETH: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
    WBTC: "0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252",   

    agUSDC: "0x291b5957c9cbe9ca6f0b98281594b4eb495f4ec1",
    agWXDAI: "0xd4e420bbf00b0f409188b338c5d87df761d6c894",
    agLINK: "0xa286ce70fb3a6269676c8d99bd9860de212252ef",
    agGNO: "0xa26783ead6c1f4744685c14079950622674ae8a8",
    agFOX: "0xa916a4891d80494c6cb0b49b11fd68238aaaf617",
    agUSDT: "0x5b4ef67c63d091083ec4d30cfc4ac685ef051046",
    agWETH: "0x44932e3b1e662adde2f7bac6d5081c5adab908c6",
    agWBTC: "0x4863cfaf3392f20531aa72ce19e5783f489817d6",

    cagUSDC: "0x6D9Dc1282B9E25a91b266B6b61eF65a38f949f22",
    cagWXDAI: "0x01aC9005F8446AF28b065af87216b85faaC5f6E2",
    cagGNO: "0xC1593302979e5e8e16E53C3303bf99fFa319D314",
    cagWBTC: "0x110e2D3d4C94596f5698C753D5cd43221D3Ec78b",
    cagWETH: "0x20e5eB701E8d711D419D444814308f8c2243461F",
    cagUSDT: "0x3D938f90AC251C1BCF6B4E399Dd72C8C685A9Bbc",

  },
} as const;

export const internalAddressesPerNetworkId: Record<
  ValidNetworkIdTypes,
  StrongTypedChainAddresses<ValidNetworkIdTypes, ValidNetworkNameTypes>
> = Object.fromEntries(
  Object.entries(internalAddressesPerNetwork).map(
    ([_k, v]) => [v.chainId, v] as const
  )
) as any;
