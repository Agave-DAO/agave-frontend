import { SwapperCoordinator__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const getUserProxyAddress = buildQueryHookWhenParamsDefinedChainAddrs<string,[],[]>(
    async (params) => {
        const coordinator = SwapperCoordinator__factory.connect(
            params.chainAddrs.swapperCoordinator,
            params.library
        );
        return await coordinator.userProxyAddress(params.account);
    },
    () => [],
    () => undefined
);
