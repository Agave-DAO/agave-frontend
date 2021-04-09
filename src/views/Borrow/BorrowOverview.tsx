import React from 'react';
import styled from 'styled-components';
import { useHistory, withRouter } from 'react-router-dom';
import Button from '../../components/Button';
import { IMarketData } from '../../utils/constants';

const BorrowOverviewWrapper = styled.div`
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
`;

function BorrowOverview({ asset }: {asset: IMarketData }) {
  const history = useHistory();
  return (
    <BorrowOverviewWrapper>
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
    </BorrowOverviewWrapper>
  );
}

export default BorrowOverview;
