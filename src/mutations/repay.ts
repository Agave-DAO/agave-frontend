import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { AgaveLendingABI__factory, WETHGateway__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { usingProgressNotification } from "../utils/progressNotification";
import { useUserAccountData } from "../queries/userAccountData";
import { useAppWeb3 } from "../hooks/appWeb3";
import {
  useUserAssetAllowance,
  useUserAssetBalance,
} from "../queries/userAssets";
import { getChainAddresses } from "../utils/chainAddresses";
import { NATIVE_TOKEN } from "../queries/allReserveTokens";
import { useWrappedNativeDefinition } from "../queries/wrappedNativeAddress";

export interface UseRepayMutationProps {
  asset: string | NATIVE_TOKEN | undefined;
  amount: BigNumber;
}

export interface UseRepayMutationDto {
  repayMutation: UseMutationResult<
    BigNumber | undefined,
    unknown,
    void,
    unknown
  >;
  repayMutationKey: readonly [
    string | null | undefined,
    string | null | undefined,
    string | null | undefined,
    BigNumber
  ];
}

export const useRepayMutation = ({
  asset,
  amount,
}: UseRepayMutationProps): UseRepayMutationDto => {
  const queryClient = useQueryClient();
  const { chainId, account, library } = useAppWeb3();
  const { data: wrappedNativeToken } = useWrappedNativeDefinition();

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
    asset !== NATIVE_TOKEN ? asset : wrappedNativeToken?.tokenAddress,
    "0x00"
  );

  const debtQueryKey = ["user", "allReserves", "debt"] as const;
  const repayMutationKey = [...debtQueryKey, amount] as const;
  const repayMutation = useMutation(
    repayMutationKey,
    async () => {
      if (!account || !library || !chainId) {
        throw new Error("Account or asset details are not available");
      }
      const chainAddresses = getChainAddresses(chainId);
      if (!chainAddresses) {
        return undefined;
      }
      if (!asset || !amount) {
        return undefined;
      }
      let repay;
      // TODO: Note that `rateMode` is fixed to 2 (variable)
      // since we don't expect to support stable rates in v1
      const rateMode = 2;
      if (asset === NATIVE_TOKEN) {
        const gatewayContract = WETHGateway__factory.connect(
          chainAddresses.wrappedNativeGateway,
          library.getSigner()
        );
        repay = gatewayContract.repayETH(amount, rateMode, account, {
          value: amount,
        });
      } else {
        const lendingContract = AgaveLendingABI__factory.connect(
          chainAddresses.lendingPool,
          library.getSigner()
        );
        repay = lendingContract.repay(asset, amount, rateMode, account);
      }

      const repayConfirmation = await usingProgressNotification(
        "Awaiting repay approval",
        "Please sign the transaction for repay.",
        "info",
        repay
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
