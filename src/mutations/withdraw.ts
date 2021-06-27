import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { AgaveLendingABI__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import {
  useUserAssetAllowance,
  useUserAssetBalance,
} from "../queries/userAssets";
import { useAppWeb3 } from "../hooks/appWeb3";
import { usingProgressNotification } from "../utils/progressNotification";
import { useUserAccountData } from "../queries/userAccountData";
import { useLendingReserveData } from "../queries/lendingReserveData";
import { getChainAddresses } from "../utils/chainAddresses";

export interface UseWithdrawMutationProps {
  asset: string | undefined;
  spender: string | undefined;
  amount: BigNumber | undefined;
}

export interface UseWithdrawMutationDto {
  withdrawMutation: UseMutationResult<
    BigNumber | undefined,
    unknown,
    void,
    unknown
  >;
  withdrawMutationKey: readonly [
    ...ReturnType<typeof useUserAssetAllowance.buildKey>,
    "withdraw",
    BigNumber | undefined
  ];
}

export const useWithdrawMutation = ({
  asset,
  spender,
  amount,
}: UseWithdrawMutationProps): UseWithdrawMutationDto => {
  const queryClient = useQueryClient();
  const { chainId, account, library } = useAppWeb3();

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
    spender ?? undefined
  );
  const withdrawnQueryKey = [...allowanceQueryKey, "withdraw"] as const;

  const withdrawMutationKey = [...withdrawnQueryKey, amount] as const;
  const withdrawMutation = useMutation(
    withdrawMutationKey,
    async () => {
      if (!library || !chainId || !account) {
        throw new Error("Account or asset details are not available");
      }
      if (!asset || !spender || !amount) {
        return undefined;
      }
      const lendingContract = AgaveLendingABI__factory.connect(
        spender,
        library.getSigner()
      );
      const withdraw = lendingContract.withdraw(asset, amount, account);
      const withdrawConfirmation = await usingProgressNotification(
        "Awaiting withdraw approval",
        "Please commit the transaction for withdrawal.",
        "info",
        withdraw
      );
      const receipt = await usingProgressNotification(
        "Awaiting withdrawal confirmation",
        "Please wait while the blockchain processes your transaction",
        "info",
        withdrawConfirmation.wait()
      );
      return receipt.status ? amount : undefined;
    },
    {
      onSuccess: async (result, vars, context) => {
        const chainAddrs = chainId ? getChainAddresses(chainId) : undefined;
        await Promise.allSettled([
          queryClient.invalidateQueries(assetBalanceQueryKey),
          queryClient.invalidateQueries(userAccountDataQueryKey),
          queryClient.invalidateQueries(allowanceQueryKey),
          queryClient.invalidateQueries(withdrawnQueryKey),
          queryClient.invalidateQueries(withdrawMutationKey),
          asset && account && chainAddrs && chainId && library
            ? useLendingReserveData
                .fetchQueryDefined(
                  { account, chainAddrs, chainId, library, queryClient },
                  asset
                )
                .then(reserveData =>
                  useUserAssetBalance.buildKey(
                    chainId ?? undefined,
                    account ?? undefined,
                    reserveData.aTokenAddress
                  )
                )
                .then(aTokenBalanceQueryKey =>
                  queryClient.invalidateQueries(aTokenBalanceQueryKey)
                )
            : Promise.resolve(),
        ]);
      },
    }
  );

  return { withdrawMutation, withdrawMutationKey };
};
