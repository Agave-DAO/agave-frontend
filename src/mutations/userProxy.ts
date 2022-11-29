import React from "react";
import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { SwapperCoordinator__factory } from "../contracts";
import { Account, ChainId } from "../utils/queryBuilder";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getChainAddresses } from "../utils/chainAddresses";
import { usingProgressNotification } from "../utils/progressNotification";

export interface UserProxyMutationProps {
    chainId: ChainId | undefined;
    address: Account | undefined;
}

export interface UserProxyMutationArgs {
    library: JsonRpcProvider;
  }

export interface UserProxyMutationResult {
    txHash: string;
}

export interface UserProxyMutationDto 
    extends UseMutationResult<
    UserProxyMutationResult | undefined,
        unknown,
        UserProxyMutationArgs,
        unknown
    >{
    key: readonly [ChainId | undefined, Account | undefined];
}

export const useUserProxyMutation =  ({
    chainId,
    address,
}: UserProxyMutationProps): UserProxyMutationDto => {
    const queryClient = useQueryClient();
    const mutationKey = React.useMemo(
        () => [chainId, address] as const,
        [chainId, address]
    );

    const mutation = useMutation<
        UserProxyMutationResult | undefined,
        unknown,
        UserProxyMutationArgs,
        unknown
    >(
        mutationKey,
        async (args): Promise<UserProxyMutationResult | undefined> => {
            const chainAddrs = chainId ? getChainAddresses(chainId) : undefined;
            if (
              chainId === undefined ||
              address === undefined ||
              chainAddrs === undefined
            ) {
              return undefined;
            }
            const signer = args.library.getSigner();           

            const coordinator = SwapperCoordinator__factory.connect(
                chainAddrs.swapperCoordinator,
                signer
            );

            console.log("useUserProxyMutation", "attempting to start user proxy");
            const userProxyRequest = coordinator.generateUserProxy();
            const userProxyConfirmation = await usingProgressNotification(
              "Awaiting transaction approval",
              "Please sign the transaction with your wallet.",
              "info",
              userProxyRequest
            );
            const userProxyReceipt = await usingProgressNotification(
              "Awaiting transaction confirmation",
              "Please wait while the blockchain processes your transaction",
              "success",
              userProxyConfirmation.wait()
            );
            return userProxyReceipt.status &&
            userProxyReceipt.events?.some(ev => ev.event === "UserProxy")
            ? { txHash: userProxyReceipt.transactionHash }
            : undefined;
        },
        {
            useErrorBoundary: false,
            retry: false,
            onSuccess: async (result) => {
                console.log("success", result);
            },
            onError: async (_err) => {
                console.log("error",_err);
            }
        },

    );

    return React.useMemo(
        () => ({ ...mutation, key: mutationKey }),
        [mutation, mutationKey]
    );

}