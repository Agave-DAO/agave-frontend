import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import Chart from "react-apexcharts";
import DepositAPYCard from "./APYCards/DepositAPYCard";
import StableBorrowAPYCard from "./APYCards/StableBorrowAPYCard";
import VariableBorrowAPYCard from "./APYCards/VariableBorrowAPYCard";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { TokenIcon } from "../../utils/icons";
import { round2Fixed } from "../../utils/helpers";

// Componete Styles  // TODO make mobile ready
const ReserveInfoWrapper = styled.div`
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  margin-right: 30px;

  .title {
    color: ${props => props.theme.color.white};
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 10px;
  }

  .reserve-content {
    color: ${props => props.theme.color.white};
    padding: 10px;
    flex: 1 1 0%;
    position: relative;
    border-radius: 15px;
    background: #007c6e;
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
        color: ${props => props.theme.color.white};

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
          align-items: center;
          justify-content: center;
          display: flex;
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
        border-radius: 5px;
        margin: 0px 15px;
        border: 1px solid ${props => props.theme.color.white};
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
        color: ${props => props.theme.color.white};
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

function ReserveInfo({ asset }) {
  // Default Componate States
  const [name, setName] = useState("AG");
  const [price, setPrice] = useState("0");
  const [liquidity, setLiquidity] = useState("0");
  const [marketsize, setMarketsize] = useState("0");
  const [totalBorrowed, setTotalBorrowed] = useState("0");
  const [maxLTV, setMaxLTV] = useState(0);
  const [liqThrsh, setLiqThrsh] = useState(0);
  const [liqPen, setLiqPen] = useState(0);
  const [collateral, setCollateral] = useState("no");
  const [stable, setStable] = useState("no");
  const [graph, setGraph] = useState("0");

  // Update Componate States // TODO input real data
  useEffect(() => {
    setName(asset.name);
    setPrice(asset.asset_price);
    setLiquidity(asset.liquidity);
    setMarketsize(asset.market_size);
    setTotalBorrowed(asset.total_borrowed);
    setMaxLTV(75);
    setLiqThrsh(25);
    setLiqPen(5);
    setCollateral("No");
    setStable("No");
    setGraph(getGraph());
  }, [asset]);

  const getGraph = () => {
    return round2Fixed(
      Number((asset.total_borrowed / asset.market_size) * 100) // TODO input real data
    );
  };

  // Component Return
  return (
    <ReserveInfoWrapper>
      <div className="title">Reserve Status & Configuration</div>
      <div className="reserve-content">
        <div className="reserve-graph-inner">
          <div className="total-value liquidity">
            <div className="total-value-inner">
              <span>
                Available Liquidity <i className="liquidity" />
              </span>
              <strong>{liquidity}</strong>
              <p>$ {liquidity * price}</p>
            </div>
          </div>
          <div className="graph-section">
            <div className="graph-inner">
              <CircularProgress
                value={graph}
                size="120px"
                color="yellow.400"
                trackColor="green.200"
              >
                <CircularProgressLabel>
                  <div className="token-icon">
                    <TokenIcon symbol={name} />
                  </div>
                </CircularProgressLabel>
              </CircularProgress>
            </div>
          </div>
          <div className="total-value borrowed">
            <div className="total-value-inner">
              <span>
                Total Borrowed <i className="borrowed" />
              </span>
              <strong>{totalBorrowed}</strong>
              <p>$ {totalBorrowed * price}</p>
            </div>
          </div>
        </div>
        <div className="reserve-middle-info">
          <div className="reserve-line">
            <div className="reserve-line-label">Reserve size</div>
            <strong className="reserve-line-value">$ {marketsize}</strong>
          </div>
          <div className="reserve-line">
            <div className="reserve-line-label">Utilization Rate</div>
            <strong className="reserve-line-value">
              {Number((totalBorrowed / marketsize) * 100).toFixed(2)} %
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
            <div className="reserve-bottom-title">Maximum LTV</div>
            <div className="reserve-bottom-content">{maxLTV} %</div>
          </div>
          <div className="reserve-bottom-block">
            <div className="reserve-bottom-title">Liquidation threshold</div>
            <div className="reserve-bottom-content">{liqThrsh} %</div>
          </div>
          <div className="reserve-bottom-block">
            <div className="reserve-bottom-title">Liquidation penalty</div>
            <div className="reserve-bottom-content">{liqPen} %</div>
          </div>
          <div className="reserve-bottom-block">
            <div className="reserve-bottom-title">Used as collateral</div>
            <div className="reserve-bottom-content green">{collateral}</div>
          </div>
          <div className="reserve-bottom-block">
            <div className="reserve-bottom-title">Stable borrowing</div>
            <div className="reserve-bottom-content green">{stable}</div>
          </div>
        </div>
      </div>
    </ReserveInfoWrapper>
  );
}

export default ReserveInfo;
