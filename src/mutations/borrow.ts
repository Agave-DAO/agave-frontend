import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { IMarketData } from "../utils/constants";
import { Web3Provider } from '@ethersproject/providers';
import { AgaveLendingABI__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { internalAddresses } from "../utils/contracts/contractAddresses/internalAddresses";
import { useBalance } from "../hooks/balance";

export interface UseBorrowMutationProps {
  asset: IMarketData | undefined;
  amount: number;
  onSuccess: () => void;
};

export interface UseBorrowMutationDto {
  borrowMutation: UseMutationResult<BigNumber | undefined, unknown, BigNumber, unknown>;
  borrowMutationKey: readonly [string | null | undefined, Web3Provider | undefined, IMarketData | undefined, number];
};

export const useBorrowMutation = ({asset, amount, onSuccess}: UseBorrowMutationProps): UseBorrowMutationDto => {
  const queryClient = useQueryClient();
  // FIXME: would be nice not to invoke a list of hooks just to get query keys
  const { balanceQueryKey } = useBalance(asset);
  const assetQueryKey = [asset?.name] as const; 
  
  const borrowMutationKey = [...balanceQueryKey, amount] as const;
  const borrowMutation = useMutation<BigNumber | undefined, unknown, BigNumber, unknown>(
    borrowMutationKey,
    async (unitAmount): Promise<BigNumber | undefined> => {
      const [address, library, asset, amount] = borrowMutationKey;
      if (!address || !library || !asset) {
        throw new Error("Account or asset details are not available");
      }
      const lender = AgaveLendingABI__factory.connect(internalAddresses.Lending, library.getSigner());
      const interestRateMode = 2;
      const referralCode = 0;
      const tx = await lender.borrow(asset.contractAddress, amount, interestRateMode, referralCode, address);
      const receipt = await tx.wait();
      return BigNumber.from(receipt.status ? amount : 0);
    },
    {
      onSuccess: async (unitAmountResult, vars, context) => {
        console.log("borrowMutation:onSuccess");
        await Promise.allSettled([
          queryClient.invalidateQueries(borrowMutationKey),
          queryClient.invalidateQueries(balanceQueryKey),
          queryClient.invalidateQueries(assetQueryKey),
        ]);
      },
    }
  );

  return { borrowMutation, borrowMutationKey };
};
