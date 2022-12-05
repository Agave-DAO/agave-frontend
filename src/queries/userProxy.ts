import { SwapperCoordinator__factory } from "../contracts";
import { SwapperUserProxy__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const getUserProxyAddressQuery = buildQueryHookWhenParamsDefinedChainAddrs<
    string,
    [],
    []
>(
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

export const getActiveOrdersQuery = buildQueryHookWhenParamsDefinedChainAddrs<
    string[],
    [],
    []
>(
    async (params) => {
        const userProxy = SwapperUserProxy__factory.connect(
            params.chainAddrs.swapperCoordinator,
            params.library
        );
        return await userProxy.getActiveOrders();
    },
    () => [],
    () => undefined
);
