import { SwapperCoordinator__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const getUserProxyAddress = buildQueryHookWhenParamsDefinedChainAddrs<string,[],[]>(
    async (params) => {
        const contract = SwapperCoordinator__factory.connect(
            params.chainAddrs.swapperCoordinator,
            params.library
        );
        return await contract.userProxyAddress(params.account);
    },
    () => [],
    () => undefined
);

