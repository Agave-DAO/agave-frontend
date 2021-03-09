import React, { useState } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Button from '../../components/Button';
import collateral from '../../utils/contracts/collateral';
import { useSelector } from 'react-redux';
import { reserveListner } from '../../utils/contracts/events/events';

const CollateralConfirmWrapper = styled.div`
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

function CollateralConfirm({ asset, history, match }) {
  const [step, setStep] = useState(1);
  const address = useSelector(state => state.authUser.address);
  const approveCollateral = async () => {
     let r = await collateral(address, match.params.assetName);
     console.log(r);
     approveCollateralReceipt(r);
  }
  const approveCollateralReceipt = async (hash) => {
    let res = await reserveListner(hash);
    if(res.status){
      setStep(step + 1);
    }
  }
  return (
    <CollateralConfirmWrapper>
      <div className="content-wrapper">
        <div className="basic-form">
          <div className="basic-form-header">
            <div className="basic-form-header-title">
              {asset.collateral ? `Do not use ${asset.name} as collateral` : `Use ${asset.name} as collateral`}
            </div>
            <div className="basic-form-header-content">
              These are your transaction details. Make sure to check if this is correct before submitting.
            </div>
          </div>
          <div className="basic-form-content">
            <div className="form-content-view">
              <div className="content-label">
                Currency
              </div>
              <div className="content-value">
                <div className="token-amount">
                  <img src={asset.img} alt="" />
                  <span>{asset.name}</span>
                </div>
              </div>
            </div>
            <div className="form-action-view">
              <div className="form-action-header">
                <div className={`form-action-step ${step === 2 ? 'success' : step > 0 ? 'active' : ''}`}>
                  <span>1</span> Usage as collateral
                </div>
                <div className={`form-action-step ${step === 2 ? 'success' : step > 1 ? 'active' : ''}`}>
                  <span>2</span> Finished
                </div>
              </div>
              {step === 1 && (
                <div className="form-action-body">
                  <div className="form-action-body-left">
                    <div className="title">
                      Usage as collateral
                    </div>
                    <div className="desc">
                      {asset.collateral ? `Please submit not to use ${asset.name} as collateral` : `Please submit to use ${asset.name} as collateral`}
                    </div>
                  </div>
                  <div className="form-action-body-right">
                    <Button variant="secondary" onClick={() => {
                      approveCollateral();
                    }}>Submit</Button>
                  </div>
                </div>
              )}
              {step === 2 && (
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
          {step !== 2 && (
            <div className="basic-form-footer">
              <Button variant="outline" onClick={() => history.goBack()}>Go back</Button>
            </div>
          )}
        </div>
      </div>
    </CollateralConfirmWrapper>
  );
}

export default compose(withRouter)(CollateralConfirm);
