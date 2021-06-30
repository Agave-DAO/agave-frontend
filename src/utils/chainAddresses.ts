import { useAppWeb3 } from "../hooks/appWeb3";
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

export function useChainAddresses(web3Key?: string | undefined): Readonly<ChainAddresses> | undefined {
  const { chainId } = useAppWeb3(web3Key);
  const chainAddresses = chainId ? getChainAddresses(chainId) : undefined;
  return chainAddresses;
}
