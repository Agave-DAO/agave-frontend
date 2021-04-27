import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { IMarketData } from "../utils/constants";
import { Web3Provider } from '@ethersproject/providers';
import { Erc20abi__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { internalAddresses } from "../utils/contracts/contractAddresses/internalAddresses";
import { ethers } from "ethers";
import { useApproved } from "../hooks/approved";

export interface UseApprovalMutationProps {
  asset: IMarketData | undefined;
  amount: number;
  onSuccess: () => void;
};

export interface UseApprovalMutationDto {
  approvalMutation: UseMutationResult<BigNumber, unknown, void, unknown>;
  approvalMutationKey: readonly [string | null | undefined, Web3Provider | undefined, IMarketData | undefined, number];
};

export const useApprovalMutation = ({asset, amount, onSuccess}: UseApprovalMutationProps): UseApprovalMutationDto => {
  const queryClient = useQueryClient();
  const { approvedQueryKey } = useApproved(asset);
  
  const approvalMutationKey = [...approvedQueryKey, amount] as const;
  const approvalMutation = useMutation(
    approvalMutationKey,
    async (newValue) => {
      const [address, library, asset, amount] = approvalMutationKey;
      if (!address || !library || !asset) {
        throw new Error("Account or asset details are not available");
      }
      const contract = Erc20abi__factory.connect(
        asset.contractAddress,
        library.getSigner()
      );
      const unitAmount = ethers.utils.parseEther(amount.toString());
      const tx = await contract.approve(internalAddresses.Lending, unitAmount);
      const receipt = await tx.wait();
      return BigNumber.from(receipt.status ? unitAmount : 0);
    },
    {
      onSuccess: async (unitAmountResult, vars, context) => {
        console.log("approvalMutation:onSuccess");
        await Promise.allSettled([
          // queryClient.invalidateQueries(approvedQueryKey), // Request that the approval query refreshes
          queryClient.setQueryData(approvedQueryKey, ethers.utils.parseEther(amount.toString())), // Update the approved amount query immediately
          queryClient.invalidateQueries(approvalMutationKey),
        ]);
        if (onSuccess) {
          onSuccess();
        }
      },
    }
  );

  return { approvalMutation, approvalMutationKey };
};
