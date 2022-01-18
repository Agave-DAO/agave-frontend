import { useMutation, UseMutationResult, useQueryClient } from "react-query";
import { AgaveLendingABI__factory } from "../contracts";
import { useAppWeb3 } from "../hooks/appWeb3";
import { useUserReserveData } from "../queries/protocolReserveData";
import { useUserAccountData } from "../queries/userAccountData";
import { getChainAddresses } from "../utils/chainAddresses";
import { usingProgressNotification } from "../utils/progressNotification";

export interface UseCollateralModeMutationDto {
  collateralModeMutation: UseMutationResult<
    boolean | undefined,
    unknown,
    boolean,
    unknown
  >;
  collateralModeMutationKey: readonly [
    ...ReturnType<typeof useUserAccountData.buildKey>,
    "collateralMode"
  ];
}

export const useCollateralModeMutation = (
  assetTokenAddress: string | undefined
): UseCollateralModeMutationDto => {
  const queryClient = useQueryClient();
  const { chainId, account, library } = useAppWeb3();

  const userAccountDataQueryKey = useUserAccountData.buildKey(
    chainId ?? undefined,
    account ?? undefined,
    account ?? undefined
  );
  const userProtocolReserveDataQueryKey = useUserReserveData.buildKey(
    chainId ?? undefined,
    account ?? undefined,
    assetTokenAddress
  );
  const collateralModeQueryKey = [
    ...userAccountDataQueryKey,
    "collateralMode",
  ] as const;

  const collateralModeMutationKey = [...collateralModeQueryKey] as const;
  const collateralModeMutation = useMutation(
    collateralModeMutationKey,
    async (useAsCollateral: boolean) => {
      if (!library || !chainId || !account) {
        throw new Error("Account or asset details are not available");
      }
      const chainAddresses = getChainAddresses(chainId);
      if (!chainAddresses) {
        return undefined;
      }
      if (assetTokenAddress === undefined) {
        return undefined;
      }
      const lendingContract = AgaveLendingABI__factory.connect(
        chainAddresses.lendingPool,
        library.getSigner()
      );
      const collateralMode = lendingContract.setUserUseReserveAsCollateral(
        assetTokenAddress,
        useAsCollateral
      );
      const collateralModeConfirmation = await usingProgressNotification(
        "Awaiting transaction approval",
        "Please sign the collateral mode assignment transaction.",
        "info",
        collateralMode
      );
      const receipt = await usingProgressNotification(
        "Awaiting transaction confirmation",
        "Please wait while the blockchain processes your transaction",
        "info",
        collateralModeConfirmation.wait()
      );
      return receipt.status ? useAsCollateral : undefined;
    },
    {
      onSuccess: async (result, vars, context) => {
        await Promise.allSettled([
          queryClient.invalidateQueries(userAccountDataQueryKey),
          queryClient.invalidateQueries(userProtocolReserveDataQueryKey),
          queryClient.invalidateQueries(collateralModeQueryKey),
          queryClient.invalidateQueries(collateralModeMutationKey),
        ]);
      },
    }
  );

  return { collateralModeMutation, collateralModeMutationKey };
};
