import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { constants } from "ethers";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useAssetPriceInDaiWei } from "./assetPriceInDai";
import { useDecimalCountForToken, weiPerToken } from "./decimalsForToken";
import { useProtocolReserveData } from "./protocolReserveData";

export const useTotalBorrowedForAsset =
  buildQueryHookWhenParamsDefinedChainAddrs<
    { wei: BigNumber; dai: FixedNumber | null; },
    [_p1: "asset", assetAddress: string | undefined, _p2: "borrowed"],
    [assetAddress: string]
  >(
    async (params, assetAddress) => {
      const [reserveData, assetPriceInDaiWei, assetDecimals] =
        await Promise.all([
          useProtocolReserveData.fetchQueryDefined(params, assetAddress),
          useAssetPriceInDaiWei.fetchQueryDefined(params, assetAddress),
          useDecimalCountForToken.fetchQueryDefined(params, assetAddress),
        ]);

      const totalBorrowedWei = reserveData.totalStableDebt.add(
        reserveData.totalVariableDebt
      );

      const daiBorrowed = assetPriceInDaiWei !== null ? FixedNumber.fromValue(
        totalBorrowedWei
          .mul(assetPriceInDaiWei)
          .mul(constants.WeiPerEther)
          .div(weiPerToken(assetDecimals)),
        18
      ) : null;

      return {
        wei: totalBorrowedWei,
        dai: daiBorrowed,
      };
    },
    assetAddress => ["asset", assetAddress, "borrowed"],
    () => undefined
  );
