import { WETHGateway__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export interface ReserveTokenDefinition {
  readonly symbol: string;
  readonly tokenAddress: string;
}

export const useWrappedNativeAddress =
  buildQueryHookWhenParamsDefinedChainAddrs<
    string,
    [_p1: "WrappedNative", _p2: "address"],
    []
  >(
    async params => {
      const contract = WETHGateway__factory.connect(
        params.chainAddrs.wrappedNativeGateway,
        params.library.getSigner()
      );
      return await contract.getWETHAddress();
    },
    () => ["WrappedNative", "address"],
    () => undefined
  );
