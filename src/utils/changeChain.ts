import {
  internalAddressesPerNetwork,
  ValidNetworkNameTypes,
  ChainAddresses,
} from "../utils/contracts/contractAddresses/internalAddresses";
import { injectedConnector } from "../hooks/injectedConnectors";

function createRequestArguments(
  method: string,
  chain: ChainAddresses
): {
  id: number;
  jsonrpc: string;
  method: string;
  params: any[];
} {
  var params;
  if (method === "wallet_switchEthereumChain") {
    params = [
      {
        chainId: `0x${chain.chainId.toString(16)}`,
      },
    ];
  } else {
    params = [
      {
        chainId: `0x${chain.chainId.toString(16)}`,
        chainName: chain.chainName,
        rpcUrls: [chain.rpcUrl],
        nativeCurrency: {
          name: chain.symbol,
          symbol: chain.symbol,
          decimals: 18,
        },
        blockExplorerUrls: [chain.explorer],
      },
    ];
  }
  return {
    id: 1,
    jsonrpc: "2.0",
    method: method,
    params: params,
  };
}

// Only supported with Metamask
export function changeChain(chainName: ValidNetworkNameTypes) {
  const chain = internalAddressesPerNetwork[chainName];

  injectedConnector.getProvider().then(async (provider: any) => {
    try {
      await provider.request(
        createRequestArguments("wallet_switchEthereumChain", chain)
      );
    } catch {
      await provider.request(
        createRequestArguments("wallet_addEthereumChain", chain)
      );
    }
  });
}
