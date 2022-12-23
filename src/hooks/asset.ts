import { useQuery } from "react-query";
import { IMarketData, marketData } from "../utils/constants";

export interface UseAssetDto {
  asset: IMarketData | undefined;
  assetQueryKey: readonly [string | undefined];
};

// DEPRECATED; try useAllReserveTokens and filtering to the symbol you want instead
export const useAsset = (assetName: string | undefined): UseAssetDto => {
  const assetQueryKey = [assetName] as const;
  const {
    data: asset,
  } = useQuery(
    assetQueryKey,
    async (ctx): Promise<IMarketData | undefined> => {
      const [assetName]: typeof assetQueryKey = ctx.queryKey;
      if (!assetName) {
        return undefined;
      }

      const asset = marketData.find((a) => a.name === assetName);
      if (!asset) {
        console.warn(`Asset ${assetName} not found`);
        return;
      }
      return asset;
    },
    {
      initialData: undefined,
    }
  );
  return { asset, assetQueryKey };
};
