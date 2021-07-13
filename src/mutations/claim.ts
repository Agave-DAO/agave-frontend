import { BigNumber } from "ethers";
import React from "react";
import { UseMutationResult, useQueryClient, useMutation } from "react-query";
import { StakedToken__factory } from "../contracts";
import { useAmountAvailableToStake } from "../queries/amountAvailableToStake";
import { getChainAddresses } from "../utils/chainAddresses";
import { usingProgressNotification } from "../utils/progressNotification";
import { Account, ChainId } from "../utils/queryBuilder";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useAmountClaimableBy } from "../queries/amountClaimableBy";
import { useStakingEvents } from "../queries/stakingEvents";

export interface ClaimMutationProps {
  chainId: ChainId | undefined;
  address: Account | undefined;
}

export interface ClaimMutationArgs {
  amount: BigNumber;
  recipient: Account;
  library: JsonRpcProvider;
}

export interface ClaimMutationResult {
  txHash: string;
}

export interface ClaimMutationDto
  extends UseMutationResult<
    ClaimMutationResult | undefined,
    unknown,
    ClaimMutationArgs,
    unknown
  > {
  key: readonly [ChainId | undefined, Account | undefined];
}

export const useClaimMutation = ({
  chainId,
  address,
}: ClaimMutationProps): ClaimMutationDto => {
  const queryClient = useQueryClient();
  const mutationKey = React.useMemo(
    () => [chainId, address] as const,
    [chainId, address]
  );

  const mutation = useMutation<
    ClaimMutationResult | undefined,
    unknown,
    ClaimMutationArgs,
    unknown
  >(
    mutationKey,
    async (args): Promise<ClaimMutationResult | undefined> => {
      const chainAddrs = chainId ? getChainAddresses(chainId) : undefined;
      if (
        chainId === undefined ||
        address === undefined ||
        chainAddrs === undefined
      ) {
        return undefined;
      }
      const signer = args.library.getSigner();
      const stakingContract = StakedToken__factory.connect(
        chainAddrs.staking,
        signer
      );
      console.log("useClaimMutation", "attempting to start claim");
      const claimRequest = stakingContract.claimRewards(
        args.recipient,
        args.amount
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
            useStakingEvents.buildKey(chainId, address, address)
          ),
          queryClient.invalidateQueries(
            useAmountClaimableBy.buildKey(chainId, address, address)
          ),
          queryClient.invalidateQueries(
            useAmountAvailableToStake.buildKey(chainId, address, address)
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
