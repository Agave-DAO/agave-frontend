import { ReactNode } from "react";
import { BigNumber } from "ethers";
import { IMarketData } from "../../../utils/constants";
import { History } from 'history';
import { UseMutationResult } from "react-query";
import { DepositWithdrawAction } from "../DepositWithdrawAction";

export interface DepositWithdrawWorkflowStep {
  genericName: string;
  getHeaderName: (action: DepositWithdrawAction) => string;
  render: (
    approval: BigNumber | undefined,
    approvalMutation: UseMutationResult<BigNumber, unknown, void, unknown>,
    actionMutation: UseMutationResult<BigNumber | undefined, unknown, BigNumber, unknown>,
    asset: IMarketData | undefined,
    amount: number,
    action: DepositWithdrawAction,
    history: History<unknown>
  ) => ReactNode;
}


export const PendingTransaction = () => (
  <div className="form-action-body">
    <div className="form-action-body-left">
      <div className="desc">Transaction is pending...</div>
    </div>
  </div>
);

export const capitalize = (str: string) => str.substring(0, 1).toUpperCase() + str.slice(1);
