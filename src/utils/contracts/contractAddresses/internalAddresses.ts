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

  readonly incentivesController: string;

  readonly explorer?: string | undefined;
  readonly rpcUrl?: string | undefined;
}

export interface ChainAddresses extends StrongTypedChainAddresses<any, any> {
  readonly chainId: number;
  readonly chainName: string;
}

export const ValidNetworkNames = ["rinkeby", "xdai"] as const;
export type ValidNetworkNameTypes = typeof ValidNetworkNames[number];

export const ValidNetworkIds = {
  rinkeby: 4,
  xdai: 100,
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

    incentivesController: "",

    explorer: "https://rinkeby.etherscan.io",
    //rpcUrl: "https://rinkeby-light.eth.linkpool.io/",
  },
  xdai: {
    chainName: "xdai",
    chainId: 100,
    symbol: "XDAI",

    lendingPool: "0x207E9def17B4bd1045F5Af2C651c081F9FDb0842",
    staking: "0x610525b415c1BFAeAB1a3fc3d85D87b92f048221",

    agaveOracle: "0x80E08A2042F4135f6cA72BA2fd0e7cAEb2Ee30ef",
    aaveProtocolDataProvider: "0xa874f66342a04c24b213BF0715dFf18818D24014",
    wrappedNativeGateway: "0x0bb31c42D0692369Ba681A925C254fEB605c327b",

    incentivesController: "0xfa255f5104f129B78f477e9a6D050a02f31A5D86",

    explorer: "https://blockscout.com/xdai/mainnet",
    rpcUrl: "https://rpc.xdaichain.com/",
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
