export interface StrongTypedChainAddresses<Id extends ValidNetworkIdTypes, Name extends ValidNetworkNameTypes> {
  readonly chainId: Id;
  readonly chainName: Name;
  readonly lendingPool: string;
  readonly staking: string;
}

export interface ChainAddresses extends StrongTypedChainAddresses<any, any> {
  readonly chainId: number;
  readonly chainName: string;
}

export const ValidNetworkNames = [
  "rinkeby",
  "xdai",
] as const;
export type ValidNetworkNameTypes = typeof ValidNetworkNames[number];

export const ValidNetworkIds = {
  "rinkeby": 4,
  "xdai": 100,
} as const;
export type ValidNetworkIdTypes = typeof ValidNetworkIds[ValidNetworkNameTypes];

export const internalAddressesPerNetwork: Record<
  ValidNetworkNameTypes,
  StrongTypedChainAddresses<ValidNetworkIdTypes, ValidNetworkNameTypes>
> = {
  rinkeby: {
    chainName: "rinkeby",
    chainId: 4,
    lendingPool: "0xeBEb4Ff34423eA229967D56D7AE1dB270e0cAc8F",
    staking: "0xdefd31e8c8e5e7db1d2e2204c99d006e1607554b",
  },
  xdai: {
    chainName: "xdai",
    chainId: 100,
    lendingPool: "0x207E9def17B4bd1045F5Af2C651c081F9FDb0842",
    staking: "0x610525b415c1BFAeAB1a3fc3d85D87b92f048221",
  },
} as const;

export const internalAddressesPerNetworkId: Record<ValidNetworkIdTypes, StrongTypedChainAddresses<ValidNetworkIdTypes, ValidNetworkNameTypes>> =
  Object.fromEntries(Object.entries(internalAddressesPerNetwork).map(([_k, v]) => [v.chainId, v] as const)) as any;

export const internalAddresses = {
  Lending: "0xeBEb4Ff34423eA229967D56D7AE1dB270e0cAc8F",
  Staking: "0xdefd31e8c8e5e7db1d2e2204c99d006e1607554b",
  assets: {
    ETH: "0x4eB1d08A6c8F907b90c3770F981E13240E4c419A",
    DAI: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
  },
  ...internalAddressesPerNetwork,
};
