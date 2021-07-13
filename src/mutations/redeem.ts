import { StakedToken__factory } from "../contracts";
import { getChainAddresses } from "../utils/chainAddresses";
import { Account, ChainId } from "../utils/queryBuilder";
import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import React from "react";
import { useAmountAvailableToStake } from "../queries/amountAvailableToStake";
import { useAmountStakedBy } from "../queries/amountStakedBy";
import { useStakingEvents } from "../queries/stakingEvents";
import { useTotalStakedForAllUsers } from "../queries/totalStakedForAllUsers";
import { usingProgressNotification } from "../utils/progressNotification";

export interface RedeemMutationProps {
  chainId: ChainId | undefined;
  address: Account | undefined;
}

export interface RedeemMutationArgs {
  amount: BigNumber;
  recipient: Account;
  library: JsonRpcProvider;
}

export interface RedeemMutationResult {
  txHash: string;
}

export interface RedeemMutationDto
  extends UseMutationResult<
    RedeemMutationResult | undefined,
    unknown,
    RedeemMutationArgs,
    unknown
  > {
  key: readonly [ChainId | undefined, Account | undefined];
}

export const useRedeemMutation = ({
  chainId,
  address,
}: RedeemMutationProps): RedeemMutationDto => {
  const queryClient = useQueryClient();
  const mutationKey = React.useMemo(
    () => [chainId, address] as const,
    [chainId, address]
  );

  const mutation = useMutation<
    RedeemMutationResult | undefined,
    unknown,
    RedeemMutationArgs,
    unknown
  >(
    mutationKey,
    async (args): Promise<RedeemMutationResult | undefined> => {
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
      console.log("useRedeemMutation", "attempting to start redeem");
      const redeemRequest = stakingContract.redeem(args.recipient, args.amount);
      const redeemConfirmation = await usingProgressNotification(
        "Awaiting redeem transaction approval",
        "Please sign the redeem transaction with your wallet.",
        "info",
        redeemRequest
      );
      const redeemReceipt = await usingProgressNotification(
        "Awaiting redeem transaction confirmation",
        "Please wait while the blockchain processes your transaction",
        "success",
        redeemConfirmation.wait()
      );
      return redeemReceipt.status &&
        redeemReceipt.events?.some(ev => ev.event === "Redeem")
        ? { txHash: redeemReceipt.transactionHash }
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
            useAmountStakedBy.buildKey(chainId, address, address)
          ),
          queryClient.invalidateQueries(
            useAmountAvailableToStake.buildKey(chainId, address, address)
          ),
          queryClient.invalidateQueries(
            useTotalStakedForAllUsers.buildKey(chainId, address)
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
