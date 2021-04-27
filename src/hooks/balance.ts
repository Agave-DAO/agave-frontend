import { useQuery } from "react-query";
import { IMarketData } from "../utils/constants";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';
import { Erc20abi__factory } from "../contracts";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";

export interface UseBalanceDto {
	balance: BigNumber | undefined;
  address: string | null | undefined;
  library: Web3Provider | undefined;
	balanceQueryKey: readonly [string | null | undefined, Web3Provider | undefined, IMarketData | undefined];
};

export const useBalance = (asset: IMarketData | undefined): UseBalanceDto => {
  const { account: address, library } = useWeb3React<Web3Provider>();
  const balanceQueryKey = [address, library, asset] as const;
  const {
    data: balance,
  } = useQuery(
    balanceQueryKey,
    async (ctx) => {
      const [address, library, asset]: typeof balanceQueryKey = ctx.queryKey;
      console.log(address, library, asset);
      if (!address || !library || !asset) {
        return undefined;
      }
      const contract = Erc20abi__factory.connect(
        asset.contractAddress,
        library.getSigner()
      );
      const tokenBalance = await contract.balanceOf(address);
      console.log("Token balance:");
      console.log(ethers.utils.formatEther(tokenBalance));
      return tokenBalance;
    },
    {
      initialData: undefined,
    }
  );
	return { balance, address, library, balanceQueryKey };
};
