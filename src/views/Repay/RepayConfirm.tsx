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
import { useRepayMutation } from "../../mutations/repay";
import { BigNumber, ethers } from "ethers";

import RepayOverview from "./RepayOverview";
/*
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import Page from '../../components/Page';
import Button from '../../components/Button';
import { marketData } from '../../utils/constants';
import RepayOverview from './RepayOverview';
import { approve, checkApproved } from '../../utils/contracts/approve';
import { approveSpendListener } from '../../utils/contracts/events/events';
import { useSelector } from 'react-redux';
import getBalance from '../../utils/contracts/getBalance';
import repay from '../../utils/contracts/repay';
import { repayListener } from '../../utils/contracts/events/events';
*/

const RepayConfirmWrapper = styled.div`
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
                background: ${props => props.theme.color.bgSecondary};
              }

              &.success {
                color: white;
                font-size: 12px;
                background: ${props => props.theme.color.green};
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

const RepayConfirm: React.FC = () => {
  const history = useHistory();
  const match =
    useRouteMatch<{
      assetName?: string | undefined;
      amount?: string | undefined;
    }>();

  const assetName = match.params.assetName;
  const [amount, setAmount] = useState<number>(0);
  // TODO: change this 'step' system to nested routes
  const [step, setStep] = useState(1);

  const { asset } = useAsset(assetName);
  const { approved: approval } = useApproved(asset);
  const { approvalMutation } = useApprovalMutation({
    asset: asset?.contractAddress,
    amount: amount ? BigNumber.from(amount) : undefined,
    spender: "0x00",
  });
  //TODO: ZedKai check repayMutation and that logic works correct...
  const { repayMutation } = useRepayMutation({
    asset,
    amount,
    onSuccess: () => {},
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

  /*
function RepayConfirm({ match, history }) {
  const [asset, setAsset] = useState({});
  const [amount, setAmount] = useState(0);
  const [step, setStep] = useState(1);
  const address = useSelector(state => state.authUser.address);
  useEffect(async () => {
    const approved = await checkApproved(address, match.params.assetName);
    if (match.params && match.params.assetName) {
      setAsset(marketData.find(item => item.name === match.params.assetName));
    }

    if (match.params && match.params.amount) {
      setAmount(match.params.amount);
    }
    if (approved > amount) {
      setStep(2)
    }
  }, [match]);
  const approveFn = async () => {
    let balance = await getBalance(address, match.params.assetName);
    let approved = await approve(address, match.params.assetName, balance);
    let receipt = await approveSpendListener(address, match.params.assetName, approved);
    if (receipt === true) {
      setStep(step + 1);
    }
  };


  const repayFn = async () => {
    let r = await repay(address, amount, match.params.assetName);
    let receipt = await repayListener(r);
    if (receipt.status){
      setStep(step + 1);
    }
  }
  */
  return (
    <Page>
      <RepayConfirmWrapper>
        {asset ? <RepayOverview asset={asset} /> : <></>}
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
                          approvalMutation.mutateAsync().then(() => setStep(2));
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
                      <div className="title">Repay</div>
                      <div className="desc">Please submit to repay</div>
                    </div>
                    <div className="form-action-body-right">
                      <Button
                        variant="secondary"
                        disabled={
                          repayMutation.isLoading ||
                          approvalMutation.isLoading ||
                          approval === undefined
                        }
                        onClick={() => {
                          repayMutation
                            .mutateAsync(
                              ethers.utils.parseEther(amount.toString())
                            )
                            .then(async result => {
                              if (result) {
                                setStep(step + 1);
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
      </RepayConfirmWrapper>
    </Page>
  );
};

export default RepayConfirm;
