import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";
import Page from "../../components/Page";
import Button from "../../components/Button";
import { AssetAmount } from "../../components/Actions/AssetAmount";
import { ConfirmationProgressHeader } from "../../components/Actions/ConfirmationProgressHeader";
import { useAsset } from "../../hooks/asset";
import { useBorrowMutation } from "../../mutations/borrow";
import { ethers } from "ethers";

import BorrowOverview from "./BorrowOverview";

const BorrowConfirmWrapper = styled.div`
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

const BorrowConfirm: React.FC = () => {
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
  const { borrowMutation } = useBorrowMutation({asset, amount, onSuccess: () => {}});

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
      <BorrowConfirmWrapper>
        {asset ? <BorrowOverview asset={asset} /> : <></>}
        <div className="content-wrapper">
          <div className="basic-form">
            <div className="basic-form-header">
              <div className="basic-form-header-title">Borrow Overview</div>
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
                  labels={["Borrow", "Finished"]}
                />
                {step === 1 && (
                  <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="title">Borrow</div>
                      <div className="desc">Please submit to borrow</div>
                    </div>
                    <div className="form-action-body-right">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          borrowMutation
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
                {step === 2 && (
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
            {step !== 2 && (
              <div className="basic-form-footer">
                <Button variant="outline" onClick={() => history.goBack()}>
                  Go back
                </Button>
              </div>
            )}
          </div>
        </div>
      </BorrowConfirmWrapper>
    </Page>
  );
};

export default BorrowConfirm;
