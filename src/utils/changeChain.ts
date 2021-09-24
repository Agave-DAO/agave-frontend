import {
  internalAddressesPerNetwork,
  ValidNetworkNameTypes,
} from "../utils/contracts/contractAddresses/internalAddresses";
import { injectedConnector } from "../hooks/injectedConnectors";

function switchEthereumChain(connector: any, chainId: number) {
  connector.request({
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
function addEthereumChain(connector: any, chain: any) {
  connector.request({
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

  injectedConnector.getProvider().then((connector: any) => {
    if (chain.chainId === 4) {
      switchEthereumChain(connector, chain.chainId);
    } else {
      addEthereumChain(connector, chain);
    }
  });
}
