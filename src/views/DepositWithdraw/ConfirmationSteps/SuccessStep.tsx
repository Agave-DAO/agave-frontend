import { DepositWithdrawWorkflowStep, PendingTransaction } from "./DepositWithdrawWorkflowStep"
import { BigNumber } from "ethers";
import { IMarketData } from "../../../utils/constants";
import { History } from 'history';
import { UseMutationResult } from "react-query";
import { DepositWithdrawAction } from "../DepositWithdrawAction";
import { Button } from "react-bootstrap";

export const SuccessStep: DepositWithdrawWorkflowStep = {
  genericName: 'success',
  getHeaderName: (_) => 'Success',
  render: (
    approval: BigNumber | undefined,
    approvalMutation: UseMutationResult<BigNumber, unknown, void, unknown>,
    actionMutation: UseMutationResult<BigNumber | undefined, unknown, BigNumber, unknown>,
    asset: IMarketData | undefined,
    amount: number,
    action: DepositWithdrawAction,
    history: History<unknown>
  ) => {
    return (
      <div className="form-action-body">
        <div className="form-action-body-left">
          <div className="title green">
            Success!
                </div>
        </div>
        <div className="form-action-body-right">
          <Button variant="secondary" onClick={() => history.push('/dashboard')}>Dashboard</Button>
        </div>
      </div>
    )
  }
};