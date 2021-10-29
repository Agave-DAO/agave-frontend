import { BigNumber } from "ethers";
import React from "react";
import { UseMutationResult, useQueryClient, useMutation } from "react-query";
import { BaseIncentivesController__factory } from "../contracts";
import { getChainAddresses } from "../utils/chainAddresses";
import { usingProgressNotification } from "../utils/progressNotification";
import { Account, ChainId } from "../utils/queryBuilder";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useUserRewards } from "../queries/rewardTokens";

export interface ClaimRewardsMutationProps {
  chainId: ChainId | undefined;
  address: Account | undefined;
}

export interface ClaimRewardsMutationArgs {
  assets: string[];
  amount: BigNumber;
  library: JsonRpcProvider;
}

export interface ClaimRewardsMutationResult {
  txHash: string;
}

export interface ClaimMutationDto
  extends UseMutationResult<
    ClaimRewardsMutationResult | undefined,
    unknown,
    ClaimRewardsMutationArgs,
    unknown
  > {
  key: readonly [ChainId | undefined, Account | undefined];
}

export const useClaimRewardsMutation = ({
  chainId,
  address,
}: ClaimRewardsMutationProps): ClaimMutationDto => {
  const queryClient = useQueryClient();
  const mutationKey = React.useMemo(
    () => [chainId, address] as const,
    [chainId, address]
  );

  const mutation = useMutation<
    ClaimRewardsMutationResult | undefined,
    unknown,
    ClaimRewardsMutationArgs,
    unknown
  >(
    mutationKey,
    async (args): Promise<ClaimRewardsMutationResult | undefined> => {
      const chainAddrs = chainId ? getChainAddresses(chainId) : undefined;
      if (
        chainId === undefined ||
        address === undefined ||
        chainAddrs === undefined
      ) {
        return undefined;
      }
      const signer = args.library.getSigner();
      const incentivesContract = BaseIncentivesController__factory.connect(
        chainAddrs.incentivesController,
        signer
      );
      console.log("useClaimMutation", "attempting to start claim");
      const claimRequest = incentivesContract.claimRewards(
        args.assets,
        args.amount,
        address
      );
      const claimConfirmation = await usingProgressNotification(
        "Awaiting claim transaction approval",
        "Please sign the claim transaction with your wallet.",
        "info",
        claimRequest
      );
      const claimReceipt = await usingProgressNotification(
        "Awaiting claim transaction confirmation",
        "Please wait while the blockchain processes your transaction",
        "success",
        claimConfirmation.wait()
      );
      return claimReceipt.status &&
        claimReceipt.events?.some(ev => ev.event === "Claim")
        ? { txHash: claimReceipt.transactionHash }
        : undefined;
    },
    {
      useErrorBoundary: false,
      retry: false,
      onSuccess: async (_output, _vars, _context) => {
        await Promise.allSettled([
          queryClient.invalidateQueries(mutationKey, {
            exact: true,
            active: false,
            inactive: true,
            refetchInactive: false,
            refetchActive: false,
          }),
          queryClient.invalidateQueries(
            useUserRewards.buildKey(chainId, address)
          ),
        ]);
      },
      onError: async (_err, _vars, _context) => {
        await queryClient.invalidateQueries(mutationKey);
      },
    }
  );

  return React.useMemo(
    () => ({ ...mutation, key: mutationKey }),
    [mutation, mutationKey]
  );
};
