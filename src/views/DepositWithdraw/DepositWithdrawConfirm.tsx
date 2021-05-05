import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";
import Page from "../../components/Page";
import Button from "../../components/Button";
import { AssetAmount } from "../../components/Actions/AssetAmount";

import { useAsset } from "../../hooks/asset";
import { useApproved } from "../../hooks/approved";
import { useApprovalMutation, UseApprovalMutationDto } from "../../mutations/approval";

import DepositWithdrawOverview from './DepositWithdrawOverview';

import { UseActionMutationProps, UseActionMutationDto } from '../../mutations/action';
import { capitalize, ApprovalStep, DepositWithdrawWorkflowStep, SubmissionStep, SuccessStep } from "./ConfirmationSteps";
import { DepositWithdrawAction } from './DepositWithdrawAction';


const DepositWithdrawConfirmWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  .content-wrapper {
    padding: 15px 0px;
    margin: 20px 0px 10px;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 0%;
    background: ${props => props.theme.color.bgWhite};

    .basic-form {
      max-width: 380px;
      margin: 0px auto;

      .basic-form-header {
        margin-bottom: 30px;
        text-align: center;
        width: 100%;
        overflow: hidden;

        .basic-form-header-title {
          width: 100%;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 10px;
          color: ${props => props.theme.color.pink};
        }

        .basic-form-header-content {
          font-size: 16px;
          text-align: center;
          color: ${props => props.theme.color.textPrimary};
        }
      }

      .basic-form-content {
        margin-bottom: 20px;
        width: 100%;

        .form-content-view {
          margin-bottom: 20px;
          width: 100%;
          border: 1px solid ${props => props.theme.color.textPrimary};
          padding: 15px;
          border-radius: 2px;
          display: flex;
          justify-content: space-between;

          .content-label {
            font-weight: 400;
            color: ${props => props.theme.color.textPrimary};
          }

          .content-value {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            .token-amount {
              display: flex;
              align-items: center;
              img {
                width: 16px;
                height: 16px;
                margin-right: 5px;
              }

              span {
                font-size: 16px;
              }
            }
            
            .usd-amount {
              font-size: 10px;
            }
          }
        }

        .form-action-view {
          width: 100%;
          background: white;
          border: 1px solid ${props => props.theme.color.textPrimary};

          .form-action-header {
            width: 100%;
            display: flex;

            .form-action-step {
              flex: 1 1 0%;
              display: flex;
              justify-content: center;
              align-items: center;
              background: rgb(241, 241, 243);
              color: ${props => props.theme.color.textPrimary};
              font-size: 12px;
              border-right: 1px solid white;

              &:last-child {
                border-right: 0;
              }

              span {
                font-size: 12px;
                font-weight: 600;
                margin-right: 5px;
              }

              &.active {
                font-size: 12px;
                background: ${props => props.theme.color.bgSecondary};
                color: white;
              }

              &.success {
                font-size: 12px;
                background: ${props => props.theme.color.green};
                color: white;
              }
            }
          }

          .form-action-body {
            color: rgb(56, 61, 81);
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;

            .form-action-body-left {
              flex: 1 1 0%;
              margin-right: 15px;
              text-align: left;

              .title {
                font-size: 14px;
                color: ${props => props.theme.color.pink};

                &.green {
                  color: ${props => props.theme.color.green};
                }
              }

              .desc {
                font-size: 12px;
                color: ${props => props.theme.color.textPrimary};
              }
            }

          }
        }
      }

      .basic-form-footer {
        margin: 20px auto 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
`;

const StepsHeader = (steps: Array<DepositWithdrawWorkflowStep>, currentStep: DepositWithdrawWorkflowStep, action: DepositWithdrawAction) => {
  return (
    <div className="form-action-header">
      {
        steps.map((step, idx) => (
          <div className={`form-action-step ${currentStep === step ? 'active' : ''}`}>
            <span>{idx + 1}</span> {step.getHeaderName(action)}
          </div>
        ))
      }
    </div>
  )
};



const depositWithdrawWorkflowSteps: { [key: string]: DepositWithdrawWorkflowStep } = [ApprovalStep, SubmissionStep, SuccessStep].reduce((acc, el) => ({ ...acc, [el.genericName]: el }), {})

export const DepositWithdrawConfirm: React.FC<{ workflowSteps: DepositWithdrawWorkflowStep[], action: DepositWithdrawAction, useActionMutation: (mutationProps: UseActionMutationProps) => UseActionMutationDto }> = ({ workflowSteps, action, useActionMutation }) => {
  const history = useHistory();
  const match = useRouteMatch<{
    assetName?: string | undefined;
    amount?: string | undefined;
    stepName?: string;
  }>();

  const { assetName, stepName } = { ...match.params, stepName: match.params.stepName || workflowSteps[0].genericName };

  const currentStep = depositWithdrawWorkflowSteps[stepName];

  const [amount, setAmount] = useState<number>(0);

  const { asset } = useAsset(assetName);
  const { approved: approval } = useApproved(asset);
  const { approvalMutation } = useApprovalMutation({
    asset,
    amount,
    onSuccess: () => { history.push(`/${action}/${asset?.name}/${amount}/${SubmissionStep.genericName}`); }
  });

  const { mutation } = useActionMutation({
    asset,
    amount,
    onSuccess: (result) => {
      if (result) {
        history.push(`/${action}/${asset?.name}/${amount}/${SuccessStep.genericName}`);
      }
    }
  });


  useEffect(() => {
    if (match.params && match.params.amount) {
      try {
        const parsed = Number(String(match.params.amount));
        if (amount !== parsed) {
          setAmount(parsed);
        }
      } catch {
        // Don't set the number if the match path isn't one
      }
    }
  }, [match, amount, setAmount]);

  return (
    <Page>
      <DepositWithdrawConfirmWrapper>
        {asset ? <DepositWithdrawOverview asset={asset} /> : <></>}
        <div className="content-wrapper">
          <div className="basic-form">
            <div className="basic-form-header">
              <div className="basic-form-header-title">
                {action} overview
                            </div>
              <div className="basic-form-header-content">
                These are your transaction details. Make sure to check if this is correct before submitting.
                            </div>
            </div>

            <div className="basic-form-content">
              <AssetAmount asset={asset} amount={amount} />
              <div className="form-action-view">
                {StepsHeader(workflowSteps, currentStep, action)}
                {currentStep.render(approval, approvalMutation, mutation, asset, amount, action, history)}
              </div>
            </div>

            {currentStep !== SubmissionStep && (
              <div className="basic-form-footer">
                <Button variant="outline" onClick={() => history.goBack()}>Go back</Button>
              </div>
            )}
          </div>
        </div>
      </DepositWithdrawConfirmWrapper>
    </Page>
  )
};
