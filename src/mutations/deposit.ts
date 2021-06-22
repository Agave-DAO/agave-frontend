import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { AgaveLendingABI__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { useUserAssetAllowance } from "../queries/userAssets";
import { useAppWeb3 } from "../hooks/appWeb3";
import { usingProgressNotification } from "../utils/progressNotification";

export interface UseDepositMutationProps {
  asset: string | undefined;
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

  const allowanceQueryKey = useUserAssetAllowance.buildKey(
    chainId ?? undefined,
    account ?? undefined,
    asset,
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
      const lendingContract = AgaveLendingABI__factory.connect(
        spender,
        library.getSigner()
      );
      const deposit = lendingContract.deposit(asset, amount, account, 0);
      const depositConfirmation = await usingProgressNotification(
        "Awaiting deposit approval",
        "Please commit the transaction for deposit.",
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
        await Promise.allSettled([
          queryClient.invalidateQueries(allowanceQueryKey),
          queryClient.invalidateQueries(depositedQueryKey),
          queryClient.invalidateQueries(depositMutationKey),
        ]);
      },
    }
  );

  return { depositMutation, depositMutationKey };
};
