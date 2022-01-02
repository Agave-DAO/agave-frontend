import { constants, BigNumber } from "ethers";
import { BaseIncentivesController__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useAllProtocolTokens } from "./allATokens";
import { createClient, gql } from "urql";
import { useProtocolReserveData } from "./protocolReserveData";
import { useAllReserveTokensWithData } from "./lendingReserveData";
import { useAssetPriceInDaiWei } from "./assetPriceInDai";
import { useDecimalCountForToken } from "./decimalsForToken";
import { bigNumberToString } from "../utils/fixedPoint";
import { useTotalMarketSize } from "./marketSize";

export interface RewardTokenData {
  id: string;
  liquidity: string;
  totalShares: string;
  __typename: string;
}

export interface TargetedTokenData {
  symbol: string;
  address: string;
  index: BigNumber;
  emissionPerSecond: BigNumber;
  emissionPerDay?: BigNumber;
  emissionPerMonth?: BigNumber;
  emissionPerYear?: BigNumber;
  tokenAPYperDay?: BigNumber;
  tokenAPYperMonth?: BigNumber;
  tokenAPYperYear?: BigNumber;
  lastUpdateTimestamp: BigNumber;
  tokenSupply: BigNumber;
}

export const useAllIncentivedAddresses =
  buildQueryHookWhenParamsDefinedChainAddrs<
    string[],
    [_p1: "useAllProtocolTokens", _p2: "incentivesController"],
    []
  >(
    async params => {
      let queriedAssets: string[] = [];
      const tokens = await useAllProtocolTokens.fetchQueryDefined(params);

      for (let i = 0; i < tokens.length; i++) {
        queriedAssets = [
          ...queriedAssets,
          (await tokens[i]).aTokenAddress,
          (await tokens[i]).variableDebtTokenAddress,
        ];
      }
      return queriedAssets;
    },
    () => ["useAllProtocolTokens", "incentivesController"],
    () => undefined,
    {
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );

// Retrieve accumulated rewards from the IncentivesController

export const useUserRewards = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_p1: "user", _p2: "incentivesController"],
  []
>(
  async params => {
    const contract = BaseIncentivesController__factory.connect(
      params.chainAddrs.incentivesController,
      params.library
    );

    const tokens = await useAllIncentivedAddresses.fetchQueryDefined(params);

    const rewards = await contract.getRewardsBalance(tokens, params.account);
    return rewards;
  },
  () => ["user", "incentivesController"],
  () => undefined,
  {
    staleTime: 1 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  }
);

// Retrieve assets data from the IncentivesController

export const useRewardTokensData = buildQueryHookWhenParamsDefinedChainAddrs<
  TargetedTokenData[],
  [_p1: "user", _p2: "asset"],
  []
>(
  async params => {
    const contract = BaseIncentivesController__factory.connect(
      params.chainAddrs.incentivesController,
      params.library
    );
    const reserveTokens = await useAllReserveTokensWithData.fetchQueryDefined(
      params
    );

    const tokens = await useAllIncentivedAddresses.fetchQueryDefined(params);
    let assetsData: TargetedTokenData[] = [];

    for (let j = 0; j < tokens.length; j++) {
      const underlying = reserveTokens.find(
        x =>
          x.variableDebtTokenAddress === tokens[j] ||
          x.aTokenAddress === tokens[j]
      );
      if (!underlying) {
        break;
      }
      const reserveData = await useProtocolReserveData.fetchQueryDefined(
        params,
        underlying.tokenAddress
      );

      const tokenSupply = reserveData
        ? underlying.aTokenAddress === tokens[j]
          ? reserveData.availableLiquidity.add(reserveData.totalVariableDebt)
          : reserveData.totalVariableDebt
        : constants.Zero;

      const reservePrice =
        (await useAssetPriceInDaiWei.fetchQueryDefined(
          params,
          underlying.tokenAddress
        )) ?? constants.Zero;

      const decimals = await useDecimalCountForToken.fetchQueryDefined(
        params,
        underlying.tokenAddress
      );

      const tokenSupplyInDaiWei = tokenSupply
        .mul(reservePrice)
        .div(BigNumber.from(10).pow(decimals));
      const assetData = await contract.getAssetData(tokens[j]);
      let dataStruct = {
        symbol: underlying.symbol,
        reserveAddress: underlying.tokenAddress,
        address: tokens[j],
        index: assetData[0],
        emissionPerSecond: assetData[1],
        lastUpdateTimestamp: assetData[2],
        tokenSupply: tokenSupplyInDaiWei,
      };

      assetsData[j] = dataStruct;
    }

    return assetsData;
  },
  () => ["user", "asset"],
  () => undefined,
  {
    staleTime: 3 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  }
);

// Retrieve reward token value per unit

const client = createClient({
  url: "https://api.thegraph.com/subgraphs/name/centfinance/cent-swap-xdai",
});

export const fetchSubgraphData = async () => {
  const subgraphQuery = gql`
    query {
      pools(where: { id: "0x65b0e9418e102a880c92790f001a9c5810b0ef32" }) {
        id
        liquidity
        totalShares
      }
    }
  `;

  const rewardTokenData = await client
    .query(subgraphQuery)
    .toPromise()
    .then(props => {
      return props.data.pools[0];
    });

  return rewardTokenData;
};

export const useRewardPricePerShare = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_p1: "user", _p2: "rewardTokenData"],
  []
>(
  async params => {
    const data: RewardTokenData = await fetchSubgraphData();
    const liquidity = parseFloat(data.liquidity);
    const totalShares = parseFloat(data.totalShares);
    const pricePerShare = liquidity / totalShares;

    // hardcoded to convert into bigNumber - better solution would be nice
    try {
      return BigNumber.from(pricePerShare * 10e15);
    } catch (error) {
      return BigNumber.from((pricePerShare * 10e15).toFixed());
    }
  },
  () => ["user", "rewardTokenData"],
  () => undefined,
  {
    staleTime: 1 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  }
);

// APY is represented in 1e16 and is simply the ratio. To get the accurate APY you need divide by 1e16 and then sum by 1.

export const useRewardTokensAPY = buildQueryHookWhenParamsDefinedChainAddrs<
  TargetedTokenData[],
  [_p1: "user", _p2: "rewardTokenData", _p3: "useRewardPricePerShare"],
  []
>(
  async params => {
    const tokensData = await useRewardTokensData.fetchQueryDefined(params);
    const priceShares = 0; // await useRewardPricePerShare.fetchQueryDefined(params);

    for (let i = 0; i < tokensData.length; i++) {
      const totalSupply = tokensData[i].tokenSupply;
      const emissionPerSecond = tokensData[i].emissionPerSecond;
      tokensData[i].emissionPerDay = emissionPerSecond.mul(60 * 60 * 24);
      tokensData[i].emissionPerMonth = emissionPerSecond.mul(60 * 60 * 24 * 30);
      tokensData[i].emissionPerYear = emissionPerSecond.mul(60 * 60 * 24 * 365);
      tokensData[i].tokenAPYperDay = tokensData[i].emissionPerDay
        ?.mul(priceShares)
        .div(totalSupply);
      tokensData[i].tokenAPYperMonth = tokensData[i].emissionPerMonth
        ?.mul(priceShares)
        .div(totalSupply);
      tokensData[i].tokenAPYperYear = tokensData[i].emissionPerYear
        ?.mul(priceShares)
        .div(totalSupply);
    }

    return tokensData;
  },
  () => ["user", "rewardTokenData", "useRewardPricePerShare"],
  () => undefined,
  {
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  }
);

export const useKpiTokensAPY = buildQueryHookWhenParamsDefinedChainAddrs<
  TargetedTokenData[],
  [_p1: "user", _p2: "rewardTokenData", _p3: "useRewardPricePerShare"],
  []
>(
  async params => {
    // KPI metrics
    const floorTVL = BigNumber.from(300000000); //3,000,000.00);
    const ceilingTVL = BigNumber.from(1200000000); //12,000,000.00);

    const tokensData = await useRewardTokensData.fetchQueryDefined(params);
    const marketsizeWei = await useTotalMarketSize.fetchQueryDefined(params);
    const marketsize = marketsizeWei.div(BigNumber.from("10000000000000000")); // converting into the same base as the floor and ceiling div() by 1e16
    let multiplier;

    // 12000 because 120k CPT tokens got locked and 100k KPI tokens were minted - Then it's caculating the position of the current TVL within the range
    if (marketsize.gte(ceilingTVL)) {
      multiplier = BigNumber.from(12000);
    } else {
      multiplier = BigNumber.from(12000)
        .mul(marketsize.sub(floorTVL))
        .div(ceilingTVL.sub(floorTVL));
    }

    let priceShares = await useRewardPricePerShare.fetchQueryDefined(params);

    if (marketsize.lte(floorTVL)) {
      priceShares = constants.Zero;
    }

    for (let i = 0; i < tokensData.length; i++) {
      const totalSupply = tokensData[i].tokenSupply;
      if (totalSupply.eq(constants.Zero)) {
        [
          tokensData[i].emissionPerDay,
          tokensData[i].emissionPerMonth,
          tokensData[i].emissionPerYear,
          tokensData[i].tokenAPYperDay,
          tokensData[i].tokenAPYperMonth,
          tokensData[i].tokenAPYperYear,
        ] = Array(6).fill(constants.Zero);
        return tokensData;
      }
      const emissionPerSecond = tokensData[i].emissionPerSecond;
      tokensData[i].emissionPerDay = emissionPerSecond.mul(60 * 60 * 24);
      tokensData[i].emissionPerMonth = emissionPerSecond.mul(60 * 60 * 24 * 30);
      tokensData[i].emissionPerYear = emissionPerSecond.mul(60 * 60 * 24 * 365);

      tokensData[i].tokenAPYperDay = tokensData[i].emissionPerDay
        ?.mul(multiplier)
        .mul(priceShares)
        .div(totalSupply);
      tokensData[i].tokenAPYperMonth = tokensData[i].emissionPerMonth
        ?.mul(multiplier)
        .mul(priceShares)
        .div(totalSupply);
      tokensData[i].tokenAPYperYear = tokensData[i].emissionPerYear
        ?.mul(multiplier)
        .mul(priceShares)
        .div(totalSupply);
    }

    return tokensData;
  },
  () => ["user", "rewardTokenData", "useRewardPricePerShare"],
  () => undefined,
  {
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  }
);
