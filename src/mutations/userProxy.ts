import React from "react";
import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { SwapperCoordinator__factory } from "../contracts";
import { Account, ChainId } from "../utils/queryBuilder";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getChainAddresses } from "../utils/chainAddresses";
import { useAppWeb3 } from "../hooks/appWeb3";
import { BigNumber } from "@ethersproject/bignumber";
import { ContractTransaction } from "ethers";

export interface UserProxyMutationProps {
    chainId: ChainId | undefined;
    address: Account | undefined;
}

export interface UserProxyMutationArgs {
    library: JsonRpcProvider;
  }

export interface UserProxyMutationResult {}

export interface UserProxyMutationDto{
    userProxyMutation: UseMutationResult<
        ContractTransaction | undefined,
        unknown,
        void,
        unknown
    >;

}

export const useUserProxyMutation =  ({
    address
}: UserProxyMutationProps): UserProxyMutationDto => {
    const queryClient = useQueryClient();
    const { chainId, account, library } = useAppWeb3();

    const userProxyMutationKey = '';

    const userProxyMutation = useMutation(
        async () => {
            
            if (!library || !chainId || !account) {
                throw new Error("Account or asset details are not available");
            }

            console.log('chainId',chainId);
            console.log('library',library);
            console.log('account',account);

            const chainAddrs = chainId ? getChainAddresses(chainId) : undefined;
            console.log('chainAddrs',chainAddrs);

            if (!chainAddrs) {
                throw new Error("chainAddrs error");
            }


            const coordinator = SwapperCoordinator__factory.connect(
                chainAddrs.swapperCoordinator,
                library.getSigner()
            );
            const receipt = await coordinator.generateUserProxy();
            return receipt;
        
        },
        {
            onMutate: async () => {
                // This function will fire before the mutation function is fired and is passed the same variables the mutation function would receive
            },
            onSuccess: async (result) => {
                // This function will fire when the mutation is successful and will be passed the mutation's result.
                console.log("success", result);
            },
            onError: async (_err) => {
                // This function will fire if the mutation encounters an error and will be passed the error.
                console.log("error",_err);
            }
        },

    );

    return {userProxyMutation}

}
/*


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
            console.log('chainAddrs',chainAddrs);
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
            return await coordinator.generateUserProxy();
        
        },
        {
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

*/
