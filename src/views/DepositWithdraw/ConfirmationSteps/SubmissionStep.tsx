import { capitalize, DepositWithdrawWorkflowStep, PendingTransaction } from "./DepositWithdrawWorkflowStep"
import { BigNumber, ethers } from "ethers";
import { IMarketData } from "../../../utils/constants";
import { History } from 'history';
import { UseMutationResult } from "react-query";
import { DepositWithdrawAction } from "../DepositWithdrawAction";
import { Button } from "react-bootstrap";

export const SubmissionStep: DepositWithdrawWorkflowStep = {
  genericName: 'submission',
  getHeaderName: capitalize,
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
        <div className="form-action-body">
          <div className="form-action-body-left">
            <div className="title">{capitalize(action)}</div>
            <div className="desc">Please submit to {action}</div>
          </div>
          <div className="form-action-body-right">
            <Button
              variant="secondary"
              disabled={actionMutation.isLoading || approvalMutation.isLoading || approval === undefined}
              onClick={() => {
                actionMutation
                  .mutateAsync(ethers.utils.parseEther(amount.toString()))
                  .then(async (result) => {
                    if (result) {
                      history.push(`/${action}/${asset?.name}/${amount}/success`);
                    }
                  });
              }}
            >
              Submit
            </Button>
          </div>
        </div>
        { actionMutation.isLoading && PendingTransaction()}
      </div>
    )
  }
}