import { ErrorCode } from "@ethersproject/logger";
import {
  Erc20abi__factory,
  StakedToken__factory,
  AaveDistributionManager__factory,
} from "../../contracts";
import { getChainAddresses } from "../../utils/chainAddresses";
import {
  Account,
  buildQueryHook,
  buildQueryHookWhenParamsDefinedChainAddrs,
  ChainId,
} from "../../utils/queryBuilder";
import { constants } from "ethers";
import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import React from "react";
import { useAmountAvailableToStake, useAmountStakedBy } from "./queries";

export interface StakeMutationProps {
  chainId: ChainId | undefined;
  address: string | undefined;
};

export interface StakeMutationArgs {
  amount: BigNumber;
  library: JsonRpcProvider;
};

export interface StakeMutationResult {
  txHash: string;
};

export interface StakeMutationDto extends UseMutationResult<StakeMutationResult | undefined, unknown, StakeMutationArgs, unknown> {
  key: readonly [ChainId | undefined, string | undefined];
};

export const useStakeMutation = ({ chainId, address }: StakeMutationProps): StakeMutationDto => {
  const queryClient = useQueryClient();
  const mutationKey = React.useMemo(() => [chainId, address] as const, [chainId, address]);
  
  const mutation = useMutation<StakeMutationResult | undefined, unknown, StakeMutationArgs, unknown>(
    mutationKey,
    async (args): Promise<StakeMutationResult | undefined> => {
      const chainAddrs = chainId ? getChainAddresses(chainId) : undefined;
      if (chainId === undefined || address === undefined || chainAddrs === undefined) {
        return undefined;
      }
      const contract = StakedToken__factory.connect(
        chainAddrs.staking,
        args.library.getSigner(),
      );
      console.log("useStakeMutation", "attempting to stake", args.amount.toString());
      const tx = await contract.stake(address, args.amount);
      const receipt = await tx.wait();
      console.log("useStakeMutation", "events produced", receipt.events);
      return receipt.status ? { txHash: tx.hash } : undefined;
    },
    {
      retry: false,
      onSuccess: async (_output, _vars, _context) => {
        const clearanceTasks = [
          queryClient.invalidateQueries(
            mutationKey,
            { exact: true, active: false, inactive: true, refetchInactive: false, refetchActive: false })
        ];
        if (address !== undefined) {
          const amountAvailableKey = useAmountAvailableToStake.buildKey(chainId, address, address);
          clearanceTasks.push(queryClient.invalidateQueries(amountAvailableKey));
          const amountStakedKey = useAmountStakedBy.buildKey(chainId, address, address);
          clearanceTasks.push(queryClient.invalidateQueries(amountStakedKey));
        }
        await Promise.allSettled(clearanceTasks);
      },
    }
  );

  return React.useMemo(() => ({ ...mutation, key: mutationKey }), [mutation, mutationKey]);
};

