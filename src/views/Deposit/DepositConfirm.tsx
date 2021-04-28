import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";
import Page from "../../components/Page";
import Button from "../../components/Button";
import { AssetAmount } from "../../components/Actions/AssetAmount";
import { ConfirmationProgressHeader } from "../../components/Actions/ConfirmationProgressHeader";
import { useAsset } from "../../hooks/asset";
import { useApproved } from "../../hooks/approved";
import { useApprovalMutation } from "../../mutations/approval";
import { useDepositMutation } from "../../mutations/deposit";
import { ethers } from "ethers";

import DepositOverview from "./DepositOverview";

const DepositConfirmWrapper = styled.div`
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
    background: ${(props) => props.theme.color.bgWhite};

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
          color: ${(props) => props.theme.color.pink};
        }

        .basic-form-header-content {
          font-size: 16px;
          text-align: center;
          color: ${(props) => props.theme.color.textPrimary};
        }
      }

      .basic-form-content {
        margin-bottom: 20px;
        width: 100%;


        .form-action-view {
          width: 100%;
          background: white;
          border: 1px solid ${(props) => props.theme.color.textPrimary};

          .form-action-header {
            width: 100%;
            display: flex;

            .form-action-step {
              flex: 1 1 0%;
              display: flex;
              justify-content: center;
              align-items: center;
              background: rgb(241, 241, 243);
              color: ${(props) => props.theme.color.textPrimary};
              font-size: 12px;

              &:not(:last-child) {
                border-right: 1px solid white;
              }

              span {
                font-size: 12px;
                font-weight: 600;
                margin-right: 5px;
              }

              &.active {
                color: white;
                font-size: 12px;
                background: ${(props) => props.theme.color.bgSecondary};
              }

              &.success {
                color: white;
                font-size: 12px;
                background: ${(props) => props.theme.color.green};
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
                color: ${(props) => props.theme.color.pink};

                &.green {
                  color: ${(props) => props.theme.color.green};
                }
              }

              .desc {
                font-size: 12px;
                color: ${(props) => props.theme.color.textPrimary};
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

const DepositConfirm: React.FC = () => {
  const history = useHistory();
  const match = useRouteMatch<{
    assetName?: string | undefined;
    amount?: string | undefined;
  }>();

  const assetName = match.params.assetName;
  const [amount, setAmount] = useState<number>(0);
  // TODO: change this 'step' system to nested routes
  const [step, setStep] = useState(1);

  const { asset } = useAsset(assetName);
  const { approved: approval } = useApproved(asset);
  const { approvalMutation } = useApprovalMutation({ asset, amount, onSuccess: () => {
    setStep(2);
  }});
  const { depositMutation } = useDepositMutation({ asset, amount, onSuccess: () => {}});

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
      <DepositConfirmWrapper>
        {asset ? <DepositOverview asset={asset} /> : <></>}
        <div className="content-wrapper">
          <div className="basic-form">
            <div className="basic-form-header">
              <div className="basic-form-header-title">Deposit Overview</div>
              <div className="basic-form-header-content">
                These are your transaction details. Make sure to check if this
                is correct before submitting.
              </div>
            </div>
            <div className="basic-form-content">
              <AssetAmount asset={asset} amount={amount} />
              <div className="form-action-view">
                <ConfirmationProgressHeader
                  step={step}
                  labels={["Approve", "Deposit", "Finished"]}
                />
                {step === 1 && (
                <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="title">Approve</div>
                      <div className="desc">
                        Please approve before depositing {amount} {assetName}
                      </div>
                    </div>
                    <div className="form-action-body-right">
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
                )}
                
                {step === 1 && approvalMutation.isLoading && (
                  <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="desc">Transaction is pending...</div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="title">Deposit</div>
                      <div className="desc">Please submit to deposit</div>
                    </div>
                    <div className="form-action-body-right">
                      <Button
                        variant="secondary"
                        disabled={depositMutation.isLoading || approvalMutation.isLoading || approval === undefined}
                        onClick={() => {
                          depositMutation
                            .mutateAsync(ethers.utils.parseEther(amount.toString()))
                            .then(async (result) => {
                              if (result) {
                                setStep(step + 1)
                              }
                            });
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="title green">Success!</div>
                    </div>
                    <div className="form-action-body-right">
                      <Button
                        variant="secondary"
                        onClick={() => history.push("/dashboard")}
                      >
                        Dashboard
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {step !== 3 && (
              <div className="basic-form-footer">
                <Button variant="outline" onClick={() => history.goBack()}>
                  Go back
                </Button>
              </div>
            )}
          </div>
        </div>
      </DepositConfirmWrapper>
    </Page>
  );
};

export default DepositConfirm;
