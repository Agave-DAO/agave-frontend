import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Page from '../../components/Page';
import Button from '../../components/Button';
import { marketData } from '../../utils/constants';

const BorrowDetailWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  .topContent {
    display: flex;
    margin-bottom: 5px;

    .topContent-section {
      margin-right: 30px;

      .topContent-section-title {
        font-size: 12px;
        color: ${props => props.theme.color.textSecondary};
        margin-right: 10px;
      }

      .topContent-section-value {
        font-size: 12px;
        color: ${props => props.theme.color.textSecondary};

        &.green {
          color: ${props => props.theme.color.green}
        }
      }
    }
  }

  .top-overview {
    width: 100%;
    border-radius: 2px;
    box-shadow: ${props => props.theme.color.boxShadow};
    background: ${props => props.theme.color.bgSecondary};

    .top-overview-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 10px 20px;
      position: relative;
      border-bottom: 2px solid ${props => props.theme.color.white};

      .top-overview-title {
        position: absolute;
        left: 20px;
        font-weight: 600;
        color: ${props => props.theme.color.textSecondary};
      }

      .top-overview-reserve {
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s ease 0s;

        &:hover {
          opacity: 0.7;
        }

        .reserve-name {
          color: ${props => props.theme.color.textSecondary};
          font-size: 14px;
          margin-left: 10px;
        }
      }
    }

    .top-overview-content {
      padding: 20px;
      display: flex;
      justify-content: space-between;

      .top-overview-content-left {
        display: flex;
        justify-content: space-between;
        flex: 1 1 0%;
        margin-right: 50px;

        .currency-overview {
          width: 45%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          &:last-child {
            justify-content: flex-start;
          }

          .currency-overview-row {
            display: flex;
            flex-flow: row wrap;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 12px;

            &:last-child {
              margin-bottom: 0;
            }

            .currency-overview-row-title {
              font-size: 14px;
              color: ${props => props.theme.color.textSecondary};
            }

            .currency-overview-row-content {
              font-size: 16px;
              font-weight: 400;
              color: ${props => props.theme.color.textSecondary};

              span {
                font-size: 16px;
                font-weight: 600;

                &.yellow {
                  color: ${props => props.theme.color.yellow};
                }

                &.green {
                  color: ${props => props.theme.color.green};
                }

                &.blue {
                  color: ${props => props.theme.color.blue};
                }

                &.pink {
                  color: ${props => props.theme.color.pink};
                }
              }
            }
          }
        }
      }

      .top-overview-content-right {
        border: 1px solid rgba(255, 255, 255, 0.5);
        color: rgb(56, 61, 81);
        width: 640px;
        border-radius: 2px;
        padding: 0px 2px;
        display: flex;
        flex-direction: column;

        .top-graph-header {
          padding: 5px 8px;
          display: flex;
          flex-flow: row wrap;
          justify-content: space-between;
          align-items: center;

          .top-graph-header-title {
            color: ${props => props.theme.color.textSecondary};
          }

          .top-graph-header-button {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex: 1 1 0%;

            .filter-section {
              display: flex;
            }
          }
        }

        .top-graph-content {
          flex: 1 1 0%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${props => props.theme.color.textSecondary};
        }
      }
    }
  }

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
          color: ${props => props.theme.color.pink};
        }

        .basic-form-header-content {
          font-size: 16px;
          text-align: center;
          color: ${props => props.theme.color.textPrimary};
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
          color: ${props => props.theme.color.textPrimary};

          .basic-form-content-top-label {
            color: ${props => props.theme.color.textPrimary};
            font-weight: 400;
            font-size: 14px;
          }

          .basic-form-content-top-value {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex: 1 1 0%;
            color: ${props => props.theme.color.textPrimary};

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
          border: 1px solid ${props => props.theme.color.bgSecondary};

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
              color: ${props => props.theme.color.textPrimary};

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
            color: ${props => props.theme.color.pink};
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

function BorrowDetail({ match, history }) {
  const [asset, setAsset] = useState({});

  useEffect(() => {
    if (match.params && match.params.assetName) {
      setAsset(marketData.find(item => item.name === match.params.assetName));
    }
  }, [match]);

  return (
    <Page>
      <BorrowDetailWrapper>
        <div className="topContent">
          <div className="topContent-section">
            <span className="topContent-section-title">
              You borrowed
            </span>
            <span className="topContent-section-value">
              300.0341 {asset.name}
            </span>
          </div>
          <div className="topContent-section">
            <span className="topContent-section-title">
              Total collateral
            </span>
            <span className="topContent-section-value">
              2,480.1911 USD
            </span>
          </div>
          <div className="topContent-section">
            <span className="topContent-section-title">
              Loan to value
            </span>
            <span className="topContent-section-value">
              78.59 %
            </span>
          </div>
          <div className="topContent-section">
            <span className="topContent-section-title">
              Health factor
            </span>
            <span className="topContent-section-value green">
              20.31
            </span>
          </div>
        </div>
        <div className="top-overview">
          <div className="top-overview-header">
            <div className="top-overview-title">
              Borrow {asset.name}
            </div>
            <div className="top-overview-reserve" onClick={() => history.push(`/reserve-overview/${asset.name}`)}>
              <img src={asset.img} alt="" width={20} height={20} />
              <span className="reserve-name">{asset.name} Reserve Overview</span>
            </div>
          </div>
          <div className="top-overview-content">
            <div className="top-overview-content-left">
              <div className="currency-overview">
                <div className="currency-overview-row">
                  <div className="currency-overview-row-title">
                    Utilization rate
                  </div>
                  <div className="currency-overview-row-content">
                    <span>8.52</span> %
                  </div>
                </div>
                <div className="currency-overview-row">
                  <div className="currency-overview-row-title">
                    Available Liquidity
                  </div>
                  <div className="currency-overview-row-content">
                    <span>13,234,234.5324</span> {asset.name}
                  </div>
                </div>
                <div className="currency-overview-row">
                  <div className="currency-overview-row-title">
                    Asset Price
                  </div>
                  <div className="currency-overview-row-content">
                    <span>0.99</span> USD
                  </div>
                </div>
              </div>
              <div className="currency-overview">
                <div className="currency-overview-row">
                  <div className="currency-overview-row-title">
                    Stable borrow APR
                  </div>
                  <div className="currency-overview-row-content">
                    <span className="blue">9.21</span> %
                  </div>
                </div>
                <div className="currency-overview-row">
                  <div className="currency-overview-row-title">
                    Variable borrow APR
                  </div>
                  <div className="currency-overview-row-content">
                    <span className="pink">0.42</span> %
                  </div>
                </div>
              </div>
            </div>
            <div className="top-overview-content-right">
              <div className="top-graph-header">
                <div className="top-graph-header-title">
                  Historical rates
                </div>
                <div className="top-graph-header-button">
                  <div className="filter-section">
                    <Button size="sm">Daily</Button>
                    <Button size="sm">Weekly</Button>
                    <Button size="sm">Monthly</Button>
                    <Button size="sm">All</Button>
                  </div>
                </div>
              </div>
              <div className="top-graph-content">
                No data to show yet
              </div>
            </div>
          </div>
        </div>
        <div className="content-wrapper">
          <div className="basic-form">
            <div className="basic-form-header">
              <div className="basic-form-header-title">
                How much would you like to borrow?
              </div>
              <div className="basic-form-header-content">
                Please enter an amount you would like to borrow. The maximum amount you can borrow is shown below.
              </div>
            </div>
            <div className="basic-form-content">
              <div className="basic-form-content-top">
                <div className="basic-form-content-top-label">
                  Available to borrow
                </div>
                <div className="basic-form-content-top-value">
                  <span>9499.032443</span> {asset.name}
                </div>
              </div>
              <div className="basic-form-content-body">
                <div className="image-section">
                  <img src={asset.img} alt="" width={30} height={30} />
                </div>
                <div className="input-section">
                  <input type="number" placeholder="Amount" step="any" min="0" />
                </div>
                <div className="max-section">
                  Max
                </div>
              </div>
            </div>
            <div className="basic-form-footer">
              <Button variant="secondary">Continue</Button>
              <Button variant="outline" onClick={() => history.goBack()}>Go back</Button>
            </div>
          </div>
        </div>
      </BorrowDetailWrapper>
    </Page>
  );
}

export default compose(withRouter)(BorrowDetail);
