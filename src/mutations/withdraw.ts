import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { IMarketData } from "../utils/constants";
import { Web3Provider } from '@ethersproject/providers';
import { AgaveLendingABI__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { internalAddresses } from "../utils/contracts/contractAddresses/internalAddresses";
import { ethers } from "ethers";
import { useApproved } from "../hooks/approved";
import { useBalance } from "../hooks/balance";

export interface UseWithdrawMutationProps {
  asset: IMarketData | undefined;
  amount: number;
  onSuccess: () => void;
};

export interface UseWithdrawMutationDto {
  withdrawMutation: UseMutationResult<BigNumber | undefined, unknown, BigNumber, unknown>;
  withdrawMutationKey: readonly [string | null | undefined, Web3Provider | undefined, IMarketData | undefined, number];
};

export const useWithdrawMutation = ({asset, amount, onSuccess}: UseWithdrawMutationProps): UseWithdrawMutationDto => {
  const queryClient = useQueryClient();
  // FIXME: would be nice not to invoke a list of hooks just to get query keys
  const { approvedQueryKey } = useApproved(asset);
  const { balanceQueryKey } = useBalance(asset);
  const assetQueryKey = [asset?.name] as const; 
  
  const withdrawMutationKey = [...approvedQueryKey, amount] as const;
  const withdrawMutation = useMutation<BigNumber | undefined, unknown, BigNumber, unknown>(
    withdrawMutationKey,
    async (unitAmount): Promise<BigNumber | undefined> => {
      const [address, library, asset, ] = withdrawMutationKey;
      if (!address || !library || !asset) {
        throw new Error("Account or asset details are not available");
      }
      const contract = AgaveLendingABI__factory.connect(
        internalAddresses.Lending,
        library.getSigner(),
      );
      console.log("withdrawMutationKey:withdraw");
      console.log(Number(ethers.utils.formatEther(unitAmount)));
      const tx = await contract.withdraw(
        asset.contractAddress,
        unitAmount,
        address,
      );
      const receipt = await tx.wait();
      return receipt.status ? BigNumber.from(unitAmount) : undefined;
    },
    {
      onSuccess: async (unitAmountResult, vars, context) => {
        await Promise.allSettled([
          queryClient.invalidateQueries(balanceQueryKey),
          queryClient.invalidateQueries(assetQueryKey),
        ]);
      },
    }
  );

  return { withdrawMutation, withdrawMutationKey };
};
