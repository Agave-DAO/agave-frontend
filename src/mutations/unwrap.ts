import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { IStaticATokenLM__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import {
  useUserAssetAllowance,
  useUserAssetBalance,
  useUserDepositAssetBalances,
  useUserDepositAssetBalancesDaiWei,
  useUserDepositAssetBalancesWithReserveInfo,
  useUserReserveAssetBalances,
  useUserReserveAssetBalancesDaiWei,
} from "../queries/userAssets";
import { useAppWeb3 } from "../hooks/appWeb3";
import { usingProgressNotification } from "../utils/progressNotification";
import { useUserAccountData } from "../queries/userAccountData";
import { useLendingReserveData } from "../queries/lendingReserveData";
import { getChainAddresses } from "../utils/chainAddresses";
import { NATIVE_TOKEN } from "../queries/allReserveTokens";
import { useWrappedNativeDefinition } from "../queries/wrappedNativeAddress";

export interface UseWithdrawMutationProps {
  asset: string;
  recipientAccount: string | undefined;
  amount: BigNumber | undefined;
  spender: string | undefined;
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
  recipientAccount,
  amount,
  spender,
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
    spender
  );
  const withdrawnQueryKey = [...allowanceQueryKey, "withdraw"] as const;

  const withdrawMutationKey = [...withdrawnQueryKey, amount] as const;
  const withdrawMutation = useMutation(
    withdrawMutationKey,
    async () => {
      if (!library || !chainId || !account) {
        throw new Error("Account or asset details are not available");
      }

      if (!asset || !recipientAccount || !amount || !spender) {
        return undefined;
      }

      let withdraw;
      const contract = IStaticATokenLM__factory.connect(
          spender,
          library.getSigner()
      );
      withdraw = contract.withdraw(account, amount, false);
      console.log("spender", spender);
      console.log("account", account);
      console.log("amount", amount);

      const withdrawConfirmation = await usingProgressNotification(
        "Awaiting withdraw approval",
        "Please sign the transaction for withdrawal.",
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
          chainId && account
            ? Promise.allSettled(
                [
                  useUserDepositAssetBalances.buildKey(chainId, account),
                  useUserDepositAssetBalancesDaiWei.buildKey(chainId, account),
                  useUserDepositAssetBalancesWithReserveInfo.buildKey(
                    chainId,
                    account
                  ),
                  useUserReserveAssetBalances.buildKey(chainId, account),
                  useUserReserveAssetBalancesDaiWei.buildKey(chainId, account),
                ].map(k => queryClient.invalidateQueries(k))
              )
            : Promise.resolve(),
          asset && account && chainAddrs && chainId && library
            ? useWrappedNativeDefinition
                .fetchQueryDefined({
                  account,
                  chainAddrs,
                  chainId,
                  library,
                  queryClient,
                })
                .then(wrappedNativeToken => {
                  useLendingReserveData
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
                    );
                })
            : Promise.resolve(),
        ]);
      },
    }
  );

  return { withdrawMutation, withdrawMutationKey };
};
