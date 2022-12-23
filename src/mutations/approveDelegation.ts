import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { VariableDebtToken__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { useUserAssetAllowance } from "../queries/userAssets";
import { useAppWeb3 } from "../hooks/appWeb3";
import { usingProgressNotification } from "../utils/progressNotification";

export interface UseApproveDelegationMutationProps {
  asset: string | undefined;
  spender: string | undefined;
  amount: BigNumber | undefined;
}

export interface UseApproveDelegationMutationDto {
  approvalMutation: UseMutationResult<
    BigNumber | undefined,
    unknown,
    void,
    unknown
  >;
  approvalMutationKey: readonly [
    ...ReturnType<typeof useUserAssetAllowance.buildKey>,
    BigNumber | undefined
  ];
}

export const useApproveDelegationMutation = ({
  asset,
  spender,
  amount,
}: UseApproveDelegationMutationProps): UseApproveDelegationMutationDto => {
  const queryClient = useQueryClient();
  const { chainId, account, library } = useAppWeb3();
  const approvedQueryKey = useUserAssetAllowance.buildKey(
    chainId ?? undefined,
    account ?? undefined,
    asset,
    spender
  );
  const approvalMutationKey = [...approvedQueryKey, amount] as const;
  const approvalMutation = useMutation(
    approvalMutationKey,
    async () => {
      if (!library || !chainId || !account) {
        throw new Error("Account or asset details are not available");
      }
      if (!asset || !spender || !amount) {
        return undefined;
      }
      const tokenContract = VariableDebtToken__factory.connect(
        asset,
        library.getSigner()
      );
      const priorAllowance = await tokenContract.borrowAllowance(
        account,
        spender
      );
      if (priorAllowance.lt(amount)) {
        const approval = tokenContract.approveDelegation(spender, amount);
        const approvalConfirmation = await usingProgressNotification(
          "Awaiting spend approval",
          "Please sign the transaction for ERC20 approval.",
          "info",
          approval
        );
        const receipt = await usingProgressNotification(
          "Awaiting approval confirmation",
          "Please wait while the blockchain processes your transaction",
          "info",
          approvalConfirmation.wait()
        );
        return receipt.status ? amount : undefined;
      } else {
        return amount;
      }
    },
    {
      onSuccess: async (result, vars, context) => {
        await Promise.allSettled([
          queryClient.invalidateQueries(approvedQueryKey),
          queryClient.invalidateQueries(approvalMutationKey),
        ]);
      },
    }
  );

  return { approvalMutation, approvalMutationKey };
};
