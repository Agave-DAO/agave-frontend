import React from "react";
import { UseMutationResult, useQueryClient, useMutation } from "react-query";
import { StakedToken__factory } from "../contracts";
import { getChainAddresses } from "../utils/chainAddresses";
import { usingProgressNotification } from "../utils/progressNotification";
import { Account, ChainId } from "../utils/queryBuilder";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useStakingCooldown } from "../queries/stakingCooldown";
import { useStakingEvents } from "../queries/stakingEvents";

export interface CooldownMutationProps {
  chainId: ChainId | undefined;
  address: Account | undefined;
}

export interface CooldownMutationArgs {
  library: JsonRpcProvider;
}

export interface CooldownMutationResult {
  txHash: string;
}

export interface CooldownMutationDto
  extends UseMutationResult<
    CooldownMutationResult | undefined,
    unknown,
    CooldownMutationArgs,
    unknown
  > {
  key: readonly [ChainId | undefined, Account | undefined];
}

export const useCooldownMutation = ({
  chainId,
  address,
}: CooldownMutationProps): CooldownMutationDto => {
  const queryClient = useQueryClient();
  const mutationKey = React.useMemo(
    () => [chainId, address] as const,
    [chainId, address]
  );

  const mutation = useMutation<
    CooldownMutationResult | undefined,
    unknown,
    CooldownMutationArgs,
    unknown
  >(
    mutationKey,
    async (args): Promise<CooldownMutationResult | undefined> => {
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
      console.log("useCooldownMutation", "attempting to start cooldown");
      const cooldownRequest = stakingContract.cooldown();
      const cooldownConfirmation = await usingProgressNotification(
        "Awaiting cooldown transaction approval",
        "Please commit the cooldown transaction with your wallet.",
        "info",
        cooldownRequest
      );
      const cooldownReceipt = await usingProgressNotification(
        "Awaiting cooldown transaction confirmation",
        "Please wait while the blockchain processes your transaction",
        "success",
        cooldownConfirmation.wait()
      );
      return cooldownReceipt.status &&
        cooldownReceipt.events?.some(ev => ev.event === "Cooldown")
        ? { txHash: cooldownReceipt.transactionHash }
        : undefined;
    },
    {
      useErrorBoundary: false,
      retry: false,
      onSuccess: async (_output, _vars, _context) => {
        const clearanceTasks = [
          queryClient.invalidateQueries(mutationKey, {
            exact: true,
            active: false,
            inactive: true,
            refetchInactive: false,
            refetchActive: false,
          }),
        ];
        const currentCooldownKey = useStakingEvents.buildKey(
          chainId,
          address,
          address
        );
        clearanceTasks.push(queryClient.invalidateQueries(currentCooldownKey));
        const cooldownKey = useStakingCooldown.buildKey(chainId, address);
        clearanceTasks.push(queryClient.invalidateQueries(cooldownKey));
        await Promise.allSettled(clearanceTasks);
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
