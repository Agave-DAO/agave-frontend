import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { Erc20abi__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { constants } from "ethers";
import { useUserAssetAllowance } from "../queries/userAssets";
import { useAppWeb3 } from "../hooks/appWeb3";
import { usingProgressNotification } from "../utils/progressNotification";
import { MAX_UINT256 } from "../utils/constants";

export interface UseApprovalMutationProps {
  asset: string | undefined;
  spender: string | undefined;
  amount: BigNumber | undefined;
}

export interface UseApprovalMutationDto {
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

export const useApprovalMutation = ({
  asset,
  spender,
  amount,
}: UseApprovalMutationProps): UseApprovalMutationDto => {
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
      const tokenContract = Erc20abi__factory.connect(
        asset,
        library.getSigner()
      );
      const priorAllowance = await tokenContract.allowance(account, spender);
      if (priorAllowance.lt(amount)) {
        // is the allowance is zero or unlimited skip the allowance reset
        if (!priorAllowance.isZero() && !priorAllowance.eq(MAX_UINT256)) {
          const approvalReset = tokenContract.approve(spender, constants.Zero);
          const approvalResetConfirmation = await usingProgressNotification(
            "Awaiting approval reset",
            "Some ERC20-like tokens require setting your allowance to 0 before changing it. Please sign the transaction resetting approval to 0.",
            "warning",
            approvalReset
          );
          await usingProgressNotification(
            "Awaiting approval reset confirmation",
            "Please wait while the blockchain processes your transaction",
            "info",
            approvalResetConfirmation.wait()
          );
        }

        const approval = tokenContract.approve(spender, amount);
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
        return receipt.status ?  amount : undefined;
      } else {
        return priorAllowance;
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
