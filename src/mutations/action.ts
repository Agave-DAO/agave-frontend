import { IMarketData } from "../utils/constants";
import { Web3Provider } from '@ethersproject/providers';
import { UseMutationResult } from "react-query";
import { BigNumber } from "@ethersproject/bignumber";

export interface UseActionMutationProps {
  asset: IMarketData | undefined;
  amount: number;
  onSuccess: (result: any) => void;
};

export interface UseActionMutationDto {
  mutation: UseMutationResult<BigNumber | undefined, unknown, BigNumber, unknown>;
  mutationKey: readonly [string | null | undefined, Web3Provider | undefined, IMarketData | undefined, number];
};