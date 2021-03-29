import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Page from '../../components/Page';
import Button from '../../components/Button';
import { marketData } from '../../utils/constants';
import DepositOverview from './DepositOverview';
import { approve, checkApproved } from '../../utils/contracts/approve';
import { useSelector } from 'react-redux';
import { approveSpendListener, depositListener } from '../../utils/contracts/events/events';
import deposit from '../../utils/contracts/deposit';
import getBalance from '../../utils/contracts/getBalance';
import userConfig from '../../utils/contracts/userconfig';
import getReserveData from '../../utils/contracts/reserveData';
import { web3 } from '../../utils/web3';
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

function DepositConfirm({ match, history }) {
  const address = useSelector(state => state.authUser.address);
  const [asset, setAsset] = useState({});
  const [amount, setAmount] = useState(0);
  const [step, setStep] = useState(1);
  const [balance, setBalance] = useState(() => {
    return getBalance(address, match.params.assetName)
  })
  const [pendingApproval, setPendingApproval] = useState(false);
  
  
  useEffect(async () => {
  
    let approved = await checkApproved(address, match.params.assetName);
    const config = await userConfig(address);
    console.log(config);
    const assetData = await getReserveData(address, match.params.assetName);
    console.log(assetData);
    if (match.params && match.params.assetName) {
      setAsset(marketData.find(item => item.name === match.params.assetName));
    }

    if (match.params && match.params.amount) {
      setAmount(match.params.amount);
    }
    
    approved = web3.utils.fromWei(approved, 'ether');

    if(approved > balance){
      setStep(2)
    }
  }, [match]);

  const approveFn = async (userAddress) => {
    let approved = await approve(userAddress, match.params.assetName, balance);
    setPendingApproval(true);
    let receipt = await approveSpendListener(address, match.params.assetName, approved);
    if (receipt === true) {
      setStep(step + 1);
      setPendingApproval(false)
    }
  };

  const depositFn = async (address, amount) => {
    let d = await deposit(address, amount, 0, match.params.assetName);
    let receipt = await depositListener(d);
    if (receipt.status) {
      setStep(step + 1);
    }
  }


  return (
    <Page>
      <DepositConfirmWrapper>
        <DepositOverview asset={asset} />
        <div className="content-wrapper">
          <div className="basic-form">
            <div className="basic-form-header">
              <div className="basic-form-header-title">
                Deposit Overview
              </div>
              <div className="basic-form-header-content">
                These are your transaction details. Make sure to check if this is correct before submitting.
              </div>
            </div>
            <div className="basic-form-content">
              <div className="form-content-view">
                <div className="content-label">
                  Amount
                </div>
                <div className="content-value">
                  <div className="token-amount">
                    <img src={asset.img} alt="" />
                    <span>{amount} {asset.name}</span>
                  </div>
                  <div className="usd-amount">
                    $ {asset.asset_price * amount}
                  </div>
                </div>
              </div>
              <div className="form-action-view">
                <div className="form-action-header">
                  <div className={`form-action-step ${step === 3 ? 'success' : step > 0 ? 'active' : ''}`}>
                    <span>1</span> Approve
                  </div>
                  <div className={`form-action-step ${step === 3 ? 'success' : step > 1 ? 'active' : ''}`}>
                    <span>2</span> Deposit
                  </div>
                  <div className={`form-action-step ${step === 3 ? 'success' : step > 2 ? 'active' : ''}`}>
                    <span>3</span> Finished
                  </div>
                </div>
                {step === 1 && (
                  <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="title">
                        Approve
                      </div>
                      <div className="desc">
                        Please approve before deposting
                      </div>
                    </div>
                    <div className="form-action-body-right">
                      <Button variant="secondary" onClick={() => {
                        approveFn(address);
                      }}>Approve</Button>
                    </div>
                  </div>
                )}
                {step === 1 && pendingApproval && (
                  <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="desc">
                        Transaction is pending...
                      </div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="form-action-body">
                    <div className="form-action-body-left">
                      <div className="title">
                        Deposit
                      </div>
                      <div className="desc">
                        Please submit to deposit
                      </div>
                    </div>
                    <div className="form-action-body-right">
                      <Button variant="secondary" onClick={() => depositFn(address, amount)}>Submit</Button>
                    </div>
                  </div>
                )}
                {step === 3 && (
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
                )}
              </div>
            </div>
            {step !== 3 && (
              <div className="basic-form-footer">
                <Button variant="outline" onClick={() => history.goBack()}>Go back</Button>
              </div>
            )}
          </div>
        </div>
      </DepositConfirmWrapper>
    </Page>
  );
}

export default compose(withRouter)(DepositConfirm);
