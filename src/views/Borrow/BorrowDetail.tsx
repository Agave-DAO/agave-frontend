import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, useRouteMatch, withRouter } from "react-router-dom";
import { store as NotificationManager } from "react-notifications-component";
import Page from "../../components/Page";
import Button from "../../components/Button";
import { IMarketData, marketData } from "../../utils/constants";
import BorrowOverview from "./BorrowOverview";
import { useSelector } from "react-redux";
import userAccount from "../../utils/contracts/userAccountData";
import { web3 } from "../../utils/web3";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";

const BorrowDetailWrapper = styled.div`
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
      max-width: 500px;
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
        width: 335px;
        padding-bottom: 25px;
        margin: 0px auto;

        .basic-form-content-top {
          display: flex;
          flex-flow: row wrap;
          align-items: flex-start;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 5px;
          color: ${(props) => props.theme.color.textPrimary};

          .basic-form-content-top-label {
            color: ${(props) => props.theme.color.textPrimary};
            font-weight: 400;
            font-size: 14px;
          }

          .basic-form-content-top-value {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex: 1 1 0%;
            color: ${(props) => props.theme.color.textPrimary};

            span {
              font-weight: 600;
              margin-right: 5px;
            }
          }
        }

        .basic-form-content-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0px 15px;
          border-radius: 2px;
          transition: all 0.2s ease 0s;
          border: 1px solid ${(props) => props.theme.color.bgSecondary};

          .image-section {
            padding-right: 10px;
          }

          .input-section {
            width: 100%;
            input {
              border: none;
              background: transparent;
              font-family: roboto-font, sans-serif;
              transition: all 0.2s ease 0s;
              font-size: 16px;
              width: 100%;
              padding: 13px 5px 13px 0px;
              appearance: none;
              box-shadow: none;
              outline: none;
              opacity: 1;
              color: ${(props) => props.theme.color.textPrimary};

              &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }
            }
          }

          .max-section {
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            color: ${(props) => props.theme.color.pink};
            transition: all 0.2s ease 0s;

            &:hover {
              opacity: 0.7;
            }
          }
        }
      }

      .basic-form-footer {
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 80px;
      }
    }
  }
`;

const BorrowDetail: React.FC<{}> = ({}) => {
  const match = useRouteMatch();
  const history = useHistory();
  const { account: address } = useWeb3React();

  const [asset, setAsset] = useState<IMarketData>();
  const [amountStr, setAmountStr] = useState<string>("");

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setAmountStr(e.target.value);
  };

  const handleBorrow: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!asset) {
      NotificationManager.addNotification({
        type: "danger",
        container: "top-right",
        message: "Please input the correct amount",
      });
      return;
    }
    if (!amountStr || isNaN(Number(amountStr))) {
      NotificationManager.addNotification({
        type: "danger",
        container: "center",
        message: "Please input a valid asset amount",
      });
      return;
    }
    history.push(`/borrow/confirm/${asset.name}/${amountStr}`);
  };

  /// TODO: when binding typechain contracts, figure out what the original author was actually trying to do here
  // useEffect(async() => {
  //   if (match.params && match.params.assetName) {
  //     let account = await userAccount(address);
  //     let image = marketData.find((data) => {
  //       return data.name === match.params.assetName;
  //     });
  //     console.log(account);
  //     let availableEth = web3.utils.fromWei(account.availableBorrowsETH, 'ether');
  //     let assetInfo = {
  //       wallet_balance: availableEth,
  //       name: match.params.assetName,
  //       img: image.img
  //     }
  //     setAsset(assetInfo);
  //   }
  // }, [match]);

  if (!asset || !address) {
    return <>No account loaded</>;
  }

  return (
    <Page>
      <BorrowDetailWrapper>
        <BorrowOverview asset={asset} />
        <div className="content-wrapper">
          <div className="basic-form">
            <div className="basic-form-header">
              <div className="basic-form-header-title">
                How much would you like to borrow?
              </div>
              <div className="basic-form-header-content">
                Please enter an amount you would like to borrow. The maximum
                amount you can borrow is shown below.
              </div>
            </div>
            <div className="basic-form-content">
              <div className="basic-form-content-top">
                <div className="basic-form-content-top-label">
                  Available to borrow
                </div>
                <div className="basic-form-content-top-value">
                  <span>{asset.wallet_balance}</span> {asset.name}
                </div>
              </div>
              <div className="basic-form-content-body">
                <div className="image-section">
                  <img src={asset.img} alt="" width={30} height={30} />
                </div>
                <div className="input-section">
                  <input
                    type="number"
                    placeholder="Amount"
                    step="any"
                    min="0"
                    value={amountStr}
                    onChange={handleInputChange}
                  />
                </div>
                <div
                  className="max-section"
                  onClick={() => setAmountStr(String(asset.wallet_balance))}
                >
                  Max
                </div>
              </div>
            </div>
            <div className="basic-form-footer">
              <Button variant="secondary" onClick={handleBorrow}>
                Continue
              </Button>
              <Button variant="outline" onClick={() => history.goBack()}>
                Go back
              </Button>
            </div>
          </div>
        </div>
      </BorrowDetailWrapper>
    </Page>
  );
};

export default withRouter(BorrowDetail);
