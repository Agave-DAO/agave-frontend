import {
  ChainAddresses,
  internalAddressesPerNetworkId,
} from "./contracts/contractAddresses/internalAddresses";

export function getChainAddresses(
  chainId: number
): Readonly<ChainAddresses> | undefined {
  return (internalAddressesPerNetworkId as Record<
    number,
    ChainAddresses | undefined
  >)[chainId];
}
