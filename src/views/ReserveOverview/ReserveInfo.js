import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Chart from "react-apexcharts";
import DepositAPYCard from './APYCards/DepositAPYCard';
import StableBorrowAPYCard from './APYCards/StableBorrowAPYCard';
import VariableBorrowAPYCard from './APYCards/VariableBorrowAPYCard';

const ReserveInfoWrapper = styled.div`
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  margin-right: 30px;

  .title {
    color: ${props => props.theme.color.textPrimary};
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 10px;
  }

  .reserve-content {
    color: ${props => props.theme.color.textPrimary};
    background: ${props => props.theme.color.bgWhite};
    padding: 10px;
    flex: 1 1 0%;
    position: relative;
    border-radius: 2px;
    box-shadow: ${props => props.theme.color.boxShadow};

    .reserve-graph-inner {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;

      .total-value {
        display: flex;
        min-width: 300px;
        color: ${props => props.theme.color.textPrimary};

        &.liquidity {
          justify-content: flex-end;
        }

        &.borrowed {
          justify-content: flex-start;
        }

        .total-value-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          span {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;

            i {
              display: block;
              width: 8px;
              height: 8px;
              margin-left: 3px;
              border-radius: 50%;

              &.liquidity {
                background: rgb(162, 162, 162);
              }

              &.borrowed {
                background: rgb(112, 112, 112);
              }
            }
          }

          strong {
            font-size: 20px;
            position: relative;
            margin-bottom: 6px;
            padding-bottom: 6px;

            &:after {
              content: "";
              position: absolute;
              bottom: 0px;
              left: 50%;
              transform: translateX(-50%);
              opacity: 0.2;
              width: 40px;
              height: 1px;
              background: ${props => props.theme.color.bgSecondary};
            }
          }

          p {
            font-size: 10px;
          }
        }
      }

      .graph-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .graph-inner {
          width: 220px;
          position: relative;
          .token-icon {
            position: absolute;
            top: 49%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: row;
            align-items: center;

            img {
              width: 50px;
              height: 50px;
            }
          }
        }
      }
    }

    .reserve-middle-info {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;

      .reserve-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        border-radius: 2px;
        margin: 0px 15px;
        border: 1px solid ${props => props.theme.color.bgSecondary};
        min-width: 200px;

        .reserve-line-label {
          font-size: 12px;
        }

        .reserve-line-value {
          margin-left: 5px;
          white-space: nowrap;
          font-size: 12px;
        }
      }
    }

    .reserve-apy-info {
      display: flex;
      justify-content: center;
      margin-bottom: 25px;
    }

    .reserve-bottom-info {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      max-width: 750px;
      margin: 0px auto;

      .reserve-bottom-block {
        color: ${props => props.theme.color.textPrimary};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;

        .reserve-bottom-title {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-start;
          position: relative;
          font-size: 12px;
        }

        .reserve-bottom-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 12px;

          &.green {
            color: ${props => props.theme.color.green};
          }
        }
      }
    }
  }
`;

function ReserveInfo({asset}) { 
  const [options, setOptions] = useState({
    chart: {
      height: 150,
      width: "100%",
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    colors: ['#707070', '#A2A2A2'],
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: false,
          }
        },
        expandOnClick: false
      }
    },
  });

  const [series, setSeries] = useState([0, 0]);

  useEffect(() => {
    setSeries([asset.liquidity, asset.total_borrowed]);
  }, [asset])
 
  return (
    <ReserveInfoWrapper>
      <div className="title">
        Reserve Status & Configuration
      </div>
      <div className="reserve-content">
        <div className="reserve-graph-inner">
          <div className="total-value liquidity">
            <div className="total-value-inner">
              <span>Available Liquidity <i className="liquidity" /></span>
              <strong>{asset.liquidity}</strong>
              <p>$ {asset.liquidity * asset.asset_price}</p>
            </div>
          </div>
          <div className="graph-section">
            <div className="graph-inner">
              <Chart
                options={options}
                series={series}
                type="donut"
              />
              <div className="token-icon">
                <img src={asset.img} alt="DAI" height="50" width="50" />
              </div>
            </div>
          </div>
          <div className="total-value borrowed">
            <div className="total-value-inner">
              <span>Total Borrowed <i className="borrowed" /></span>
              <strong>{asset.total_borrowed}</strong>
              <p>$ {asset.total_borrowed * asset.asset_price}</p>
            </div>
          </div>
        </div>
        <div className="reserve-middle-info">
          <div className="reserve-line">
            <div className="reserve-line-label">
              Reserve size
            </div>
            <strong className="reserve-line-value">
              $ {asset.market_size}
            </strong>
          </div>
          <div className="reserve-line">
            <div className="reserve-line-label">
              Utilization Rate
            </div>
            <strong className="reserve-line-value">
              {Number(asset.total_borrowed / asset.market_size * 100).toFixed(2)} %
            </strong>
          </div>
        </div>
        <div className="reserve-apy-info">
          <DepositAPYCard />
          <StableBorrowAPYCard />
          <VariableBorrowAPYCard />
        </div>
        <div className="reserve-bottom-info">
          <div className="reserve-bottom-block">
            <div className="reserve-bottom-title">
              Maximum LTV
            </div>
            <div className="reserve-bottom-content">
              75.00 %
            </div>
          </div>
          <div className="reserve-bottom-block">
            <div className="reserve-bottom-title">
              Liquidation threshold
            </div>
            <div className="reserve-bottom-content">
              80.00 %
            </div>
          </div>
          <div className="reserve-bottom-block">
            <div className="reserve-bottom-title">
              Liquidation penalty
            </div>
            <div className="reserve-bottom-content">
              5.00 %
            </div>
          </div>
          <div className="reserve-bottom-block">
            <div className="reserve-bottom-title">
              Used as collateral
            </div>
            <div className="reserve-bottom-content green">
              Yes
            </div>
          </div>
          <div className="reserve-bottom-block">
            <div className="reserve-bottom-title">
              Stable borrowing
            </div>
            <div className="reserve-bottom-content green">
              Yes
            </div>
          </div>
        </div>
      </div>
    </ReserveInfoWrapper>
  );
}

export default ReserveInfo;
