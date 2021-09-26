import type { ExternalProvider } from "@ethersproject/providers";
import type { AbstractConnector } from "@web3-react/abstract-connector";
import {
  ChainAddresses, internalAddressesPerNetwork,
  ValidNetworkNameTypes
} from "../utils/contracts/contractAddresses/internalAddresses";

interface RpcRequestParameter {
  chainId: string;
  chainName?: string | null;
  rpcUrls?: (string | undefined)[];
  blockExplorerUrls?: (string | undefined)[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

interface RpcCallSpec {
  id: number;
  jsonrpc: string;
  method: string;
  params: RpcRequestParameter[];
}

let currentRequestId = 1;
function nextRequestId(): number {
  return currentRequestId++;
}

function createSwitchRequestParameters(chain: ChainAddresses): {
  method: string;
  params: Array<RpcRequestParameter>;
} {
  return {
    method: "wallet_switchEthereumChain",
    params: [
      {
        chainId: `0x${chain.chainId.toString(16)}`,
      },
    ],
  };
}

function createAddRequestParameters(chain: ChainAddresses): {
  method: string;
  params: Array<RpcRequestParameter>;
} {
  return {
    method: "wallet_addEthereumChain",
    params: [
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
    ],
  };
}

function createRequestArguments(
  requestParams: Readonly<{
    method: string;
    params: Array<RpcRequestParameter>;
  }>
): RpcCallSpec {
  return {
    id: nextRequestId(),
    jsonrpc: "2.0",
    method: requestParams.method,
    params: requestParams.params,
  };
}

type RpcSwitchChainResponse = null | string | Error;
type RpcAddChainResponse = null | string | Error;

// Only supported with Metamask
export async function changeChain(
  connector: AbstractConnector,
  chainName: ValidNetworkNameTypes
): Promise<boolean | undefined> {
  const chain = internalAddressesPerNetwork[chainName];
  const provider: ExternalProvider | null | undefined =
    await connector.getProvider();
  if (!provider?.request) {
    // Provider is not present or lacks request capacity, return semaphor
    // value of undefined to indicate lack of actionable RPC provider.
    return undefined;
  }
  try {
    const response: RpcSwitchChainResponse = await provider.request?.(
      createRequestArguments(createSwitchRequestParameters(chain))
    );
    return (response ?? null) === null; //  EIP 3326, some failures return an error type
  } catch {
    try {
      const response: RpcAddChainResponse = await provider.request?.(
        createRequestArguments(createAddRequestParameters(chain))
      );
      return (response ?? null) === null; // EIP 3085, some failures return an error type
    } catch {
      return false;
    }
  }
}
