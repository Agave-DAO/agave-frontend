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
import {
  useWrappedNativeAddress,
  useWrappedNativeDefinition,
} from "../queries/wrappedNativeAddress";
import { useUserReserveData } from "../queries/protocolReserveData";

export interface UseDepositMutationProps {
  asset: string | NATIVE_TOKEN | undefined;
  spender: string | undefined;
  amount: BigNumber | undefined;
}

export interface UseDepositMutationDto {
  depositMutation: UseMutationResult<
    BigNumber | undefined,
    unknown,
    void,
    unknown
  >;
  depositMutationKey: readonly [
    ...ReturnType<typeof useUserAssetAllowance.buildKey>,
    "deposit",
    BigNumber | undefined
  ];
}

export const useDepositMutation = ({
  asset,
  spender,
  amount,
}: UseDepositMutationProps): UseDepositMutationDto => {
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
    asset !== NATIVE_TOKEN ? asset : wrappedNativeToken?.tokenAddress
  );
  const allowanceQueryKey = useUserAssetAllowance.buildKey(
    chainId ?? undefined,
    account ?? undefined,
    asset !== NATIVE_TOKEN ? asset : wrappedNativeToken?.tokenAddress,
    spender ?? undefined
  );
  const depositedQueryKey = [...allowanceQueryKey, "deposit"] as const;

  const depositMutationKey = [...depositedQueryKey, amount] as const;
  const depositMutation = useMutation(
    depositMutationKey,
    async () => {
      if (!library || !chainId || !account) {
        throw new Error("Account or asset details are not available");
      }
      if (!asset || !spender || !amount) {
        return undefined;
      }
      const contract = IStaticATokenLM__factory.connect(
        spender,
        library.getSigner()
      );

      let deposit = contract.deposit(account, amount, 0, false);
      const depositConfirmation = await usingProgressNotification(
        "Awaiting deposit approval",
        "Please sign the transaction for deposit.",
        "info",
        deposit
      );
      const receipt = await usingProgressNotification(
        "Awaiting deposit confirmation",
        "Please wait while the blockchain processes your transaction",
        "info",
        depositConfirmation.wait()
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
          queryClient.invalidateQueries(depositedQueryKey),
          queryClient.invalidateQueries(depositMutationKey),
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
            ? useWrappedNativeAddress
                .fetchQueryDefined({
                  account,
                  chainAddrs,
                  chainId,
                  library,
                  queryClient,
                })
                .then(wrappedNativeTokenAddress => {
                  useLendingReserveData
                    .fetchQueryDefined(
                      { account, chainAddrs, chainId, library, queryClient },
                      asset !== NATIVE_TOKEN ? asset : wrappedNativeTokenAddress
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
                  const userReserveDataKey = useUserReserveData.buildKey(
                    chainId ?? undefined,
                    account ?? undefined,
                    asset !== NATIVE_TOKEN ? asset : wrappedNativeTokenAddress
                  );
                  queryClient.invalidateQueries(userReserveDataKey);
                })
            : Promise.resolve(),
        ]);
      },
    }
  );

  return { depositMutation, depositMutationKey };
};
