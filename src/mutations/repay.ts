import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { IMarketData } from "../utils/constants";
import { Web3Provider } from '@ethersproject/providers';
import { AgaveLendingABI__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { internalAddresses } from "../utils/contracts/contractAddresses/internalAddresses";
import { ethers } from "ethers";
import { useApproved } from "../hooks/approved";
import { useBalance } from "../hooks/balance";
import { useApprovalMutation } from "./approval";

export interface UseRepayMutationProps {
  asset: IMarketData | undefined;
  amount: number;
  onSuccess: () => void;
};

export interface UseRepayMutationDto {
  repayMutation: UseMutationResult<BigNumber | undefined, unknown, BigNumber, unknown>;
  repayMutationKey: readonly [string | null | undefined, Web3Provider | undefined, IMarketData | undefined, number];
};

export const useRepayMutation = ({asset, amount, onSuccess}: UseRepayMutationProps): UseRepayMutationDto => {
  const queryClient = useQueryClient();
  // FIXME: would be nice not to invoke a list of hooks just to get query keys
  const { approvedQueryKey } = useApproved(asset);
	const { approvalMutationKey } = useApprovalMutation({ asset, amount, onSuccess: () => {}});
  const { balanceQueryKey } = useBalance(asset);
  const assetQueryKey = [asset?.name] as const; 
  
  const repayMutationKey = [...approvedQueryKey, amount] as const;
  const repayMutation = useMutation<BigNumber | undefined, unknown, BigNumber, unknown>(
    repayMutationKey,
    async (unitAmount): Promise<BigNumber | undefined> => {
      const [address, library, asset, ] = repayMutationKey;
      if (!address || !library || !asset) {
        throw new Error("Account or asset details are not available");
      }
      const contract = AgaveLendingABI__factory.connect(
        internalAddresses.Lending,
        library.getSigner()
      );
      const referralCode = 0;
      console.log("repayMutationKey:repay");
      console.log(Number(ethers.utils.formatEther(unitAmount)));
      
      //TODO: ZedKai convert the deposit to be repay...
      const tx = await contract.deposit(
        asset.contractAddress,
        unitAmount,
        address,
        referralCode
      );

      const receipt = await tx.wait();
      return receipt.status ? BigNumber.from(unitAmount) : undefined;
    },
    {
      onSuccess: async (unitAmountResult, vars, context) => {
        await Promise.allSettled([
          queryClient.invalidateQueries(approvedQueryKey),
          queryClient.invalidateQueries(approvalMutationKey),
          queryClient.invalidateQueries(balanceQueryKey),
          queryClient.invalidateQueries(assetQueryKey),
        ]);
      },
    }
  );

  return { repayMutation, repayMutationKey };
};
