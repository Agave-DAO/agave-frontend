import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { AgaveLendingABI__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { internalAddresses } from "../utils/contracts/contractAddresses/internalAddresses";
import { usingProgressNotification } from "../utils/progressNotification";
import { useUserAccountData } from "../queries/userAccountData";
import { useAppWeb3 } from "../hooks/appWeb3";
import { useUserAssetAllowance, useUserAssetBalance } from "../queries/userAssets";
import { getChainAddresses } from "../utils/chainAddresses";

export interface UseRepayMutationProps {
  asset: string | undefined;
  amount: BigNumber;
};

export interface UseRepayMutationDto {
  repayMutation: UseMutationResult<
    BigNumber | undefined,
    unknown,
    void,
    unknown
  >;
  repayMutationKey: readonly [string | null | undefined, string | null | undefined, string | null | undefined, BigNumber];
};

export const useRepayMutation = ({asset, amount}: UseRepayMutationProps): UseRepayMutationDto => {
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
  const repayMutation = useMutation(
    repayMutationKey,
    async () => {
      if (!account || !library || !asset || !chainId) {
        throw new Error("Account or asset details are not available");
      }
      const chainAddresses = getChainAddresses(chainId);
      if (!chainAddresses) {
        return undefined;
      }
      const contract = AgaveLendingABI__factory.connect(
        chainAddresses.lendingPool,
        library.getSigner()
      );

      // TODO: Note that `rateMode` is fixed to 2 (variable)
      // since we don't expect to support stable rates in v1
      const rateMode = 2;
      const tx = contract.repay(
        asset,
        amount,
        rateMode,
        account,
      );
      const repayConfirmation = await usingProgressNotification(
        "Awaiting repay approval",
        "Please sign the transaction for repay.",
        "info",
        tx
      );
      const receipt = await usingProgressNotification(
        "Awaiting repay confirmation",
        "Please wait while the blockchain processes your transaction",
        "info",
        repayConfirmation.wait()
      );
      return receipt.status ? BigNumber.from(amount) : undefined;
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
