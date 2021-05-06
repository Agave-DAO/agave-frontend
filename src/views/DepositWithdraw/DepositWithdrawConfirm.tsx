import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";
import Page from "../../components/Page";
import { AssetAmount } from "../../components/Actions/AssetAmount";
import { useAsset } from "../../hooks/asset";
import DepositWithdrawOverview from './DepositWithdrawOverview';
import { UseActionMutationDto } from '../../mutations/action';
import { DepositWithdrawAction } from './DepositWithdrawAction';
import { MultiStep } from "../MultiSteps/MultiSteps";
import { useDepositMutation } from "../../mutations/deposit";
import { useWithdrawMutation } from "../../mutations/withdraw";
import { IMarketData } from "../../utils/constants";
import { useApprovalMutation } from "../../mutations/approval";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import { capitalize } from "@material-ui/core/utils";


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

export const DepositWithdrawConfirm: React.FC<void> = () => {
  const match = useRouteMatch<{
    action: string;
    assetName?: string | undefined;
    amount?: string | undefined;
  }>();

  const { assetName, action } = match.params ;
  const { asset } = useAsset(assetName);

  const [amount, setAmount] = useState<number>(0);

  const useActionMutation = action === DepositWithdrawAction.Deposit ? useDepositMutation : useWithdrawMutation;

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
                {capitalize(action)} overview
                            </div>
              <div className="basic-form-header-content">
                These are your transaction details. Make sure to check if this is correct before submitting.
                            </div>
            </div>

            <div className="basic-form-content">
              <AssetAmount asset={asset} amount={amount} />

              <MultiStep
                  action={action}
                  amount={amount}
                  asset={asset}
              >
                { 
                  action === DepositWithdrawAction.Deposit ? 
                  <ApprovalStep header="Approve" /> 
                  : undefined
                } 
                <SubmissionStep 
                  header={`${capitalize(action)}`} 
                  useMutation={useActionMutation} 
                />
                <SuccessStep 
                  header="Finished" 
                />
              </MultiStep>
            </div>

          </div>
        </div>
      </DepositWithdrawConfirmWrapper>
    </Page>
  )
};

const PendingTransaction = () => (
  <div className="form-action-body">
    <div className="form-action-body-left">
      <div className="desc">Transaction is pending...</div>
    </div>
  </div>
);


export const ApprovalStep: React.FC<{
  next?: () => void,
  action?: string,
  amount?: number,
  asset?: IMarketData,
  header?: string,
}> = (props: {
  next?: () => void,
  action?: string,
  amount?: number,
  asset?: IMarketData,
  header?: string,
}) => {
    const { approvalMutation } = useApprovalMutation({
      asset: props.asset,
      amount: props.amount!,
      onSuccess: () => {
        if (props.next) {
          props.next();
        }
      }
    });

    return (
      <div>
        <div className="form-action-body" >
          <div className="form-action-body-left" >
            <div className="title" > Approve </div>
            < div className="desc" >
              Please approve before {props.action}ing {props.amount} {props.asset?.name}
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
        { approvalMutation.isLoading && <PendingTransaction />}
      </div>
    );
  };

export const SubmissionStep: React.FC<{
  next?: () => void,
  action?: string,
  amount?: number,
  asset?: IMarketData,
  header?: string,
  useMutation?: (args: { asset: IMarketData, amount: number, onSuccess: () => void }) => UseActionMutationDto,
}> = (props: {
  next?: () => void,
  action?: string,
  amount?: number,
  asset?: IMarketData,
  header?: string,
  useMutation?: (args: { asset: IMarketData, amount: number, onSuccess: () => void }) => UseActionMutationDto,
}) => {
    const { next, asset, action, amount, useMutation } = props;

    const { mutation: actionMutation } = useMutation!({ asset: asset!, amount: amount!, onSuccess: next! });

    const { approvalMutation } = useApprovalMutation({
      asset: props.asset,
      amount: props.amount!,
      onSuccess: () => {
        if (props.next) {
          props.next();
        }
      }
    });

    return (
      <div>
        <div className="form-action-body">
          <div className="form-action-body-left">
            <div className="title">{action}</div>
            <div className="desc">Please submit to {action}</div>
          </div>
          <div className="form-action-body-right">
            <Button
              variant="secondary"
              disabled={actionMutation.isLoading || approvalMutation.isLoading}
              onClick={() => {
                actionMutation
                  .mutateAsync(ethers.utils.parseEther(amount!.toString()))
                  .then(async (result) => {
                    if (result) {
                      if (next) {
                        next();
                      }
                    }
                  });
              }}
            >
              Submit
              </Button>
          </div>
        </div>
        { actionMutation.isLoading && <PendingTransaction />}
      </div>
    )
  }

export const SuccessStep: React.FC<{ header?: string, }> = (props: { header?: string }) => {
  const history = useHistory();
  return <div className="form-action-body">
    <div className="form-action-body-left">
      <div className="title green">
        Success!
      </div>
    </div>
    <div className="form-action-body-right">
      <Button variant="secondary" onClick={() => history.push('/dashboard')}>Dashboard</Button>
    </div>
  </div>;
}

