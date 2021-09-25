import {
  internalAddressesPerNetwork,
  ValidNetworkNameTypes,
} from "../utils/contracts/contractAddresses/internalAddresses";
import { injectedConnector } from "../hooks/injectedConnectors";
import { InjectedConnector } from "@web3-react/injected-connector";

async function switchEthereumChain(provider: any, chainId: number) {
  await provider.request({
    id: 1,
    jsonrpc: "2.0",
    method: "wallet_switchEthereumChain",
    params: [
      {
        chainId: "0x" + chainId.toString(16),
      },
    ],
  });
}
async function addEthereumChain(provider: any, chain: any) {
  await provider.request({
    id: 1,
    jsonrpc: "2.0",
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x" + chain.chainId.toString(16),
        chainName: chain.chainName,
        rpcUrls: [chain.rpcUrl],
        nativeCurrency: {
          name: chain.symbol,
          symbol: chain.symbol,
          decimals: 18,
        },
        blockExplorerUrls: [chain.explorer],
      },
    ],
  });
}

// Only supported with Metamask
export function changeChain(chainName: ValidNetworkNameTypes) {
  const chain = internalAddressesPerNetwork[chainName];

  injectedConnector.getProvider().then(async (provider: any) => {
    try {
      await switchEthereumChain(provider, chain.chainId);
    } catch {
      await addEthereumChain(provider, chain);
    }
  });
}
