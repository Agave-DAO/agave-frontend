import { BigNumber } from "@ethersproject/bignumber";
import {
  StakedToken__factory,
  AgaveLendingABI__factory,
  ILendingPoolAddressesProvider__factory,
  IPriceOracleGetter__factory,
} from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const useStakingAgavePrice = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber | undefined,
  [_prefixStaking: "staking", _prefixAgavePrice: "agavePrice"],
  []
>(
  async params => {
    const signer = params.library;
    const stakingContract = StakedToken__factory.connect(
      params.chainAddrs.staking,
      signer
    );
    const lendingPool = AgaveLendingABI__factory.connect(
      params.chainAddrs.lendingPool,
      signer
    );
    const [addressProvider, stakedTokenAddress] = await Promise.all([
      lendingPool
        .getAddressesProvider()
        .then(addr =>
          ILendingPoolAddressesProvider__factory.connect(addr, signer)
        ),
      stakingContract.STAKED_TOKEN(),
    ]);
    const priceOracle = await addressProvider
      .getPriceOracle()
      .then(addr => IPriceOracleGetter__factory.connect(addr, signer));
    console.log("PriceOracle at:", priceOracle.address);
    console.log("StakedToken:", stakedTokenAddress);
    try {
      return await priceOracle.getAssetPrice(stakedTokenAddress);
    } catch (e) {
      if (e.code === -32603) {
        console.log("Price oracle missing for token");
        return undefined;
      }
      throw e;
    }
  },
  () => ["staking", "agavePrice"],
  () => undefined
);
