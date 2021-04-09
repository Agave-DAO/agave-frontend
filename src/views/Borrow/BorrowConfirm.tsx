import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, useRouteMatch, withRouter } from "react-router-dom";
import Page from "../../components/Page";
import Button from "../../components/Button";
import { marketData, IMarketData } from "../../utils/constants";
import BorrowOverview from "./BorrowOverview";
import { useSelector } from "react-redux";
import borrow from "../../utils/contracts/borrow";
import { borrowListener } from "../../utils/contracts/events/events";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";

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

        .form-content-view {
          margin-bottom: 20px;
          width: 100%;
          border: 1px solid ${(props) => props.theme.color.textPrimary};
          padding: 15px;
          border-radius: 2px;
          display: flex;
          justify-content: space-between;

          .content-label {
            font-weight: 400;
            color: ${(props) => props.theme.color.textPrimary};
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
                background: ${(props) => props.theme.color.bgSecondary};
                color: white;
              }

              &.success {
                font-size: 12px;
                background: ${(props) => props.theme.color.green};
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

const BorrowConfirm: React.FC<{}> = ({}) => {
  const match = useRouteMatch<{
    assetName?: string | undefined;
    amount?: string | undefined;
  }>();
  const history = useHistory();
  const [asset, setAsset] = useState<IMarketData>();
  const [amount, setAmount] = useState(0);
  // TODO: change this 'step' system to nested routes
  const [step, setStep] = useState(1);
  const { account: address } = useWeb3React();

  useEffect(() => {
    if (match.params && match.params.assetName) {
      setAsset(marketData.find((item) => item.name === match.params.assetName));
    }

    if (match.params && match.params.amount) {
      try {
        const parsed = new BigNumber(String(match.params.amount));
        if (amount != parsed.toNumber()) {
          setAmount(amount);
        }
      } catch {
        // Don't set the number if the match path isn't one
      }
    }
  }, [match]);
  const borrowFn = async () => {
    if (!address) {
      return;
    }
    const r = await borrow(address, amount, match.params.assetName);
    const receipt = await borrowListener(r);
    if (receipt.status) {
      setStep(step + 1);
    }
  };
  return (
    <Page>
      <BorrowConfirmWrapper>
        {asset ? <BorrowOverview asset={asset} /> : <></>}
        <div className="content-wrapper">
          <div className="basic-form">
            <div className="basic-form-header">
              <div className="basic-form-header-title">Borrow overview</div>
              <div className="basic-form-header-content">
                These are your transaction details. Make sure to check if this
                is correct before submitting.
              </div>
            </div>
            <div className="basic-form-content">
              <div className="form-content-view">
                <div className="content-label">Amount</div>
                {asset ? (
                  <div className="content-value">
                    <div className="token-amount">
                      <img src={asset.img} alt="" />
                      <span>
                        {amount} {asset.name}
                      </span>
                    </div>
                    <div className="usd-amount">
                      $ {asset.asset_price * amount}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="form-action-view">
                <div className="form-action-header">
                  <div
                    className={`form-action-step ${
                      step === 2 ? "success" : step > 0 ? "active" : ""
                    }`}
                  >
                    <span>1</span> Borrow
                  </div>
                  <div
                    className={`form-action-step ${
                      step === 2 ? "success" : step > 1 ? "active" : ""
                    }`}
                  >
                    <span>2</span> Finished
                  </div>
                </div>
                {step === 1 && (
                  <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="title">Borrow</div>
                      <div className="desc">Please submit to borrow</div>
                    </div>
                    <div className="form-action-body-right">
                      <Button variant="secondary" onClick={() => borrowFn()}>
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
