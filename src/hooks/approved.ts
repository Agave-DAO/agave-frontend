import { useQuery } from "react-query";
import { IMarketData } from "../utils/constants";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';
import { Erc20abi__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { getChainAddresses } from "../utils/chainAddresses";

export interface UseApprovedDto {
  approved: BigNumber | undefined;
  approvedQueryKey: readonly [string | null | undefined, Web3Provider | undefined, IMarketData | undefined, number | undefined];
};

export const useApproved = (asset: IMarketData | undefined): UseApprovedDto => {
  const { account: address, library, chainId } = useWeb3React<Web3Provider>();
  const approvedQueryKey = [address, library, asset, chainId] as const;
  
  const {
    data: approved,
  } = useQuery(
    approvedQueryKey,
    async (ctx): Promise<BigNumber | undefined> => {
      const [address, library, asset, chainId]: typeof approvedQueryKey = ctx.queryKey;
      if (!address || !library || !asset || !chainId) {
        return undefined;
      }
      const chainAddresses = getChainAddresses(chainId);
      if (!chainAddresses) {
        return undefined;
      }
      const contract = Erc20abi__factory.connect(
        asset.contractAddress,
        library.getSigner()
      );
      const allowance = await contract.allowance(address, chainAddresses.lendingPool);
      return allowance;
    },
    {
      initialData: BigNumber.from(0),
    }
  );
  return { approved, approvedQueryKey };
};
