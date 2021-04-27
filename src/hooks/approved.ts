import { useQuery } from "react-query";
import { IMarketData } from "../utils/constants";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';
import { Erc20abi__factory } from "../contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { internalAddresses } from "../utils/contracts/contractAddresses/internalAddresses";

export interface UseApprovedDto {
  approved: BigNumber | undefined;
  approvedQueryKey: readonly [string | null | undefined, Web3Provider | undefined, IMarketData | undefined];
};

export const useApproved = (asset: IMarketData | undefined): UseApprovedDto => {
  const { account: address, library } = useWeb3React<Web3Provider>();
  const approvedQueryKey = [address, library, asset] as const;
  
  const {
    data: approved,
  } = useQuery(
    approvedQueryKey,
    async (ctx): Promise<BigNumber | undefined> => {
      const [address, library, asset]: typeof approvedQueryKey = ctx.queryKey;
      if (!address || !library || !asset) {
        return undefined;
      }
      const contract = Erc20abi__factory.connect(
        asset.contractAddress,
        library.getSigner()
      );
      const allowance = await contract.allowance(address, internalAddresses.Lending);
      return allowance;
    },
    {
      initialData: BigNumber.from(0),
    }
  );
  return { approved, approvedQueryKey };
};
