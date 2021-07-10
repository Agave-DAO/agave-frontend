import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { AgaveLendingABI__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { internalAddresses } from "../utils/contracts/contractAddresses/internalAddresses";
import { ethers } from "ethers";
import { useUserAccountData } from "../queries/userAccountData";
import { useAppWeb3 } from "../hooks/appWeb3";
import { useUserAssetAllowance, useUserAssetBalance } from "../queries/userAssets";

export interface UseRepayMutationProps {
  asset: string | undefined;
  amount: BigNumber;
  onSuccess: () => void;
};

export interface UseRepayMutationDto {
  repayMutation: UseMutationResult<BigNumber | undefined, unknown, BigNumber, unknown>;
  repayMutationKey: readonly [string | null | undefined, string | null | undefined, string | null | undefined, BigNumber];
};

export const useRepayMutation = ({asset, amount, onSuccess}: UseRepayMutationProps): UseRepayMutationDto => {
  const queryClient = useQueryClient();
  const { chainId, account, library } = useAppWeb3()

  const userAccountDataQueryKey = useUserAccountData.buildKey(
    chainId ?? undefined,
    account ?? undefined,
    account ?? undefined
  );
  const assetBalanceQueryKey = useUserAssetBalance.buildKey(
    chainId ?? undefined,
    account ?? undefined,
    asset
  );
  const allowanceQueryKey = useUserAssetAllowance.buildKey(
    chainId ?? undefined,
    account ?? undefined,
    asset,
    "0x00"
  )

  const debtQueryKey = ["user", "allReserves", "debt"] as const;
  const repayMutationKey = [...debtQueryKey, amount] as const;
  const repayMutation = useMutation<BigNumber | undefined, unknown, BigNumber, unknown>(
    repayMutationKey,
    async (unitAmount): Promise<BigNumber | undefined> => {
      if (!account || !library || !asset) {
        throw new Error("Account or asset details are not available");
      }
      const contract = AgaveLendingABI__factory.connect(
        internalAddresses.Lending,
        library.getSigner()
      );
      console.log("repayMutationKey:repay");
      console.log(Number(ethers.utils.formatEther(unitAmount)));
      
      // TODO: Note that `rateMode` is fixed to 2 (variable)
      // since we don't expect to support stable rates in v1
      const rateMode = 2;
      const tx = await contract.repay(
        asset,
        unitAmount,
        rateMode,
        account,
      );

      const receipt = await tx.wait();
      return receipt.status ? BigNumber.from(unitAmount) : undefined;
    },
    {
      onSuccess: async (unitAmountResult, vars, context) => {
        await Promise.allSettled([
          queryClient.invalidateQueries(allowanceQueryKey),
          queryClient.invalidateQueries(userAccountDataQueryKey),
          queryClient.invalidateQueries(assetBalanceQueryKey),
        ]);
      },
    }
  );

  return { repayMutation, repayMutationKey };
};
