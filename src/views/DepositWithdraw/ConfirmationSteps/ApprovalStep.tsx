import { DepositWithdrawWorkflowStep, PendingTransaction } from "./DepositWithdrawWorkflowStep"
import { BigNumber } from "ethers";
import { IMarketData } from "../../../utils/constants";
import { History } from 'history';
import { UseMutationResult } from "react-query";
import { DepositWithdrawAction } from "../DepositWithdrawAction";
import { Button } from "react-bootstrap";

export const ApprovalStep: DepositWithdrawWorkflowStep = {
  genericName: 'approval',
  getHeaderName: (_) => 'Approval',
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
      <div>
        <div className="form-action-body" >
          <div className="form-action-body-left" >
            <div className="title" > Approve </div>
            < div className="desc" >
              Please approve before {action.toLocaleLowerCase()} ing {amount} {asset?.name}
            </div>
          </div>
          < div className="form-action-body-right" >
            <Button
              disabled={approvalMutation.isLoading}
              variant="secondary"
              onClick={() => {
                approvalMutation.mutate();
              }}
            >
              Approve
        </Button>
          </div>
        </div>
        { approvalMutation.isLoading && PendingTransaction()}
      </div>
    );
  }
};
