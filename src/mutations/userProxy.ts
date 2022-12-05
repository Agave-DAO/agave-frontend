import React, { useEffect } from "react";
import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { SwapperCoordinator__factory } from "../contracts";
import { Account, ChainId } from "../utils/queryBuilder";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getChainAddresses } from "../utils/chainAddresses";
import { usingProgressNotification } from "../utils/progressNotification";
import { getUserProxyAddressQuery} from "../queries/userProxy";

export interface UserProxyMutationProps {
    chainId: ChainId | undefined;
    address: Account | undefined;
}

export interface UserProxyMutationArgs {
    library: JsonRpcProvider,
    setLayout: any
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

}

export const useUserProxyMutation =  ({
    chainId,
    address,
}: UserProxyMutationProps): UserProxyMutationDto => {
    const queryClient = useQueryClient();
    const userProxyAddress = getUserProxyAddressQuery()['data'];


    const mutation = useMutation<
        UserProxyMutationResult | undefined,
        unknown,
        UserProxyMutationArgs,
        unknown
    >(
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
            onSuccess: async (data, args, context) => {
                console.log("Success!");
                console.log('Data', data);
                console.log('Context', context);
                args.setLayout('test');
            },
            onError: async (_err) => {
                console.log("error",_err);
            }
        },

    );


    return React.useMemo(
        () => ({ ...mutation }),
        [mutation]
    );

}