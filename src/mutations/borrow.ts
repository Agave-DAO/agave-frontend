import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { AgaveLendingABI__factory, WETHGateway__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import {
  useUserAssetAllowance,
  useUserAssetBalance,
  useUserDepositAssetBalances,
  useUserDepositAssetBalancesDaiWei,
  useUserDepositAssetBalancesWithReserveInfo,
  useUserReserveAssetBalances,
  useUserReserveAssetBalancesDaiWei,
  useUserVariableDebtForAsset,
  useUserVariableDebtTokenBalances,
  useUserVariableDebtTokenBalancesDaiWei,
} from "../queries/userAssets";
import { useAppWeb3 } from "../hooks/appWeb3";
import { usingProgressNotification } from "../utils/progressNotification";
import { useUserAccountData } from "../queries/userAccountData";
import { useLendingReserveData } from "../queries/lendingReserveData";
import { getChainAddresses } from "../utils/chainAddresses";
import { useUserReserveData } from "../queries/protocolReserveData";
import { NATIVE_TOKEN } from "../queries/allReserveTokens";
import { useWrappedNativeDefinition } from "../queries/wrappedNativeAddress";

export interface UseBorrowMutationProps {
  asset: string | NATIVE_TOKEN | undefined;
  onBehalfOf: string | undefined;
  amount: BigNumber | undefined;
}

export interface UseBorrowMutationDto {
  borrowMutation: UseMutationResult<
    BigNumber | undefined,
    unknown,
    void,
    unknown
  >;
  borrowMutationKey: readonly [
    ...ReturnType<typeof useUserAssetAllowance.buildKey>,
    "borrow",
    BigNumber | undefined
  ];
}

export const useBorrowMutation = ({
  asset,
  onBehalfOf,
  amount,
}: UseBorrowMutationProps): UseBorrowMutationDto => {
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
    onBehalfOf ?? undefined
  );
  const variableDebtQueryKey = useUserVariableDebtForAsset.buildKey(
    chainId ?? undefined,
    account ?? undefined,
    asset !== NATIVE_TOKEN ? asset : wrappedNativeToken?.tokenAddress
  );
  const userProtocolReserveDataQueryKey = useUserReserveData.buildKey(
    chainId ?? undefined,
    account ?? undefined,
    asset !== NATIVE_TOKEN ? asset : wrappedNativeToken?.tokenAddress
  );
  const borrowQueryKey = [...allowanceQueryKey, "borrow"] as const;

  const borrowMutationKey = [...borrowQueryKey, amount] as const;
  const borrowMutation = useMutation(
    borrowMutationKey,
    async () => {
      if (!library || !chainId || !account) {
        throw new Error("Account or asset details are not available");
      }
      const chainAddresses = getChainAddresses(chainId);
      if (!chainAddresses) {
        return undefined;
      }
      if (!asset || !onBehalfOf || !amount) {
        return undefined;
      }

      let borrow;
      const interestRateMode = 2;
      const referralCode = 0;
      if (asset === NATIVE_TOKEN) {
        const gatewayContract = WETHGateway__factory.connect(
          chainAddresses.wrappedNativeGateway,
          library.getSigner()
        );
        borrow = gatewayContract.borrowETH(
          amount,
          interestRateMode,
          referralCode
        );
      } else {
        const lendingContract = AgaveLendingABI__factory.connect(
          chainAddresses.lendingPool,
          library.getSigner()
        );
        borrow = lendingContract.borrow(
          asset,
          amount,
          interestRateMode,
          referralCode,
          account
        );
      }
      const lendingContract = AgaveLendingABI__factory.connect(
        chainAddresses.lendingPool,
        library.getSigner()
      );

      const borrowConfirmation = await usingProgressNotification(
        "Awaiting borrow approval",
        "Please sign the borrowing transaction.",
        "info",
        borrow
      );
      const receipt = await usingProgressNotification(
        "Awaiting borrow confirmation",
        "Please wait while the blockchain processes your transaction",
        "info",
        borrowConfirmation.wait()
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
          queryClient.invalidateQueries(variableDebtQueryKey),
          queryClient.invalidateQueries(userProtocolReserveDataQueryKey),
          queryClient.invalidateQueries(borrowQueryKey),
          queryClient.invalidateQueries(borrowMutationKey),
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
                  useUserVariableDebtTokenBalances.buildKey(chainId, account),
                  useUserVariableDebtTokenBalancesDaiWei.buildKey(
                    chainId,
                    account
                  ),
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
                      asset !== NATIVE_TOKEN
                        ? asset
                        : wrappedNativeToken.tokenAddress
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

  return { borrowMutation, borrowMutationKey };
};
