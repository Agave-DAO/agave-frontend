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

  readonly swapperCoordinator: string;

  readonly explorer?: string | undefined;
  readonly rpcUrl?: string | undefined;
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

    swapperCoordinator: "",

    explorer: "https://rinkeby.etherscan.io",
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

    swapperCoordinator: "0x6d09B58230be2E721EeD4E116b352Bb5050910E5",

    explorer: "https://blockscout.com/xdai/mainnet",
    rpcUrl: "https://rpc.gnosischain.com/",
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
