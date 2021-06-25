import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { Switch } from "@chakra-ui/react";

// Componete Styles
const Btn = styled.div`
  .agvebtn1 {
    color: ${props => (!props.disabled ? props.color : `${props.color}55`)};
    background-color: ${props => props.theme.color.white};
    border-radius: 7px;

    width: 10rem;
    height: ${props => props.height}px;
    padding: 0.5rem;
    margin: 0.5rem:
    font-family: ${props => props.theme.color.fonts};

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => props.fontSize}px;
    cursor: pointer;

    pointer-events: ${props => (!props.disabled ? undefined : "none")};
    transition: all 0.2s ease 0s;
    &:hover {
      box-shadow: 0px 0px 1px 1px;
    }
  }

  .agvebtn2 {
    color: ${props => (!props.disabled ? props.color : `${props.color}55`)};
    // background-color: rgba(0, 0, 0, 0);
    border-radius: 7px;

    width: 10rem;
    height: ${props => props.height}px;
    padding: 0.5rem;
    margin: 0.5rem:
    font-family: ${props => props.theme.color.fonts};

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => props.fontSize}px;
    cursor: pointer;

    pointer-events: ${props => (!props.disabled ? undefined : "none")};
    transition: all 0.2s ease 0s;
    &:hover {
      color: white;
    }
  }
`;
const UserInfoWrapper = styled.div`
  width: 440px;
  display: flex;
  flex-direction: column;

  .userinfo-title {
    color: ${props => props.theme.color.white};
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 400;
    width: 100%;
  }

  .userinfo-widget-title {
    color: ${props => props.theme.color.white};
  }

  .userinfo-content {
    position: relative;
    width: 100%;

    .userinfo-wrapper {
      padding: 15px;
      margin-bottom: 15px;
      position: relative;
      box-shadow: ${props => props.theme.color.boxShadow};
      border-radius: 15px;
      background: #007c6e;

      .userinfo-wrapper-top {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .userinfo-wrapper-top-buttons {
          display: flex;

          div:first-child {
            margin-right: 5px;
          }
        }
      }

      .userinfo-wrapper-content {
        .userinfo-wrapper-content-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;

          &:last-child {
            margin-bottom: 0;
          }

          .userinfo-wrapper-content-label {
            font-size: 14px;
            font-weight: 400;
            color: ${props => props.theme.color.white};
          }

          .userinfo-wrapper-content-value {
            font-size: 14px;
            font-weight: 400;
            color: ${props => props.theme.color.white};

            &.green {
              color: ${props => props.theme.color.green};
            }
            &.yellow {
              color: #ecc94b;
            }
          }
          .switch {
            padding-left: 10px;
          }
        }
      }
    }
  }
`;

function UserInfo({ asset, history }) {
  // Default Componate States
  const [name, setName] = useState("AG");
  const [userSupply, setUserSupply] = useState("0");
  const [userBal, setUserBal] = useState("0");
  const [userBorrow, setUserBorrow] = useState("0");
  const [useAsCol, setUseAsCol] = useState(false);
  const [health, setHealth] = useState("0");
  const [loanVal, setLoanVal] = useState("0");
  const [borrowAmt, setBorrowAmt] = useState("0");

  // Update Componate States // TODO input real data
  useEffect(() => {
    setName(asset.name);
    setUserSupply(asset.supply_balance);
    setUserBorrow(asset.borrow_balance);
    setUserBal(asset.wallet_balance);
    setUseAsCol(asset.collateral);
    setHealth(21.22);
    setLoanVal(50);
    setBorrowAmt(1900);
  }, [asset]);

  return (
    <UserInfoWrapper>
      <div className="userinfo-title">Your information</div>
      <div className="userinfo-content">
        <div className="userinfo-wrapper">
          <div className="userinfo-wrapper-top">
            <span className="userinfo-widget-title">Deposits</span>
            <div className="userinfo-wrapper-top-buttons">
              <Btn>
                <button
                  className="agvebtn1"
                  onClick={() => history.push(`/deposit/${name}`)}
                >
                  Deposit
                </button>
              </Btn>
              <Btn>
                <button
                  className="agvebtn2"
                  onClick={() => history.push(`/withdraw/${name}`)}
                >
                  Withdraw
                </button>
              </Btn>
            </div>
          </div>
          <div className="userinfo-wrapper-content">
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                Your wallet balance
              </div>
              <div className="userinfo-wrapper-content-value">
                {userBal} {name}
              </div>
            </div>
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                You already deposited
              </div>
              <div className="userinfo-wrapper-content-value">
                {userSupply} {name}
              </div>
            </div>
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                Use as collateral
              </div>
              <div className="userinfo-wrapper-content-value yellow">
                <div className="userinfo-wrapper-content-value">
                  {useAsCol ? "Yes" : "No"}

                  <Switch
                    className="switch"
                    isChecked={useAsCol}
                    aria-label={"yes"}
                    colorScheme="yellow"
                    onChange={() => {
                      history.push(`/collateral/${name}`);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* BORROW SECTION START */}
        <div className="userinfo-wrapper">
          <div className="userinfo-wrapper-top">
            <span className="userinfo-widget-title">Borrows</span>
            <div className="userinfo-wrapper-top-buttons">
              <Btn>
                <button
                  className="agvebtn1"
                  onClick={() => history.push(`/borrow/${name}`)}
                >
                  Borrow
                </button>
              </Btn>
            </div>
          </div>
          <div className="userinfo-wrapper-content">
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">Borrowed</div>
              <div className="userinfo-wrapper-content-value">
                {userBorrow} {name}
              </div>
            </div>
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                Health factor
              </div>
              <div className="userinfo-wrapper-content-value yellow">
                {health}
              </div>
            </div>
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                Loan to value
              </div>
              <div className="userinfo-wrapper-content-value">{loanVal} %</div>
            </div>
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                Available to you
              </div>
              <div className="userinfo-wrapper-content-value">
                {borrowAmt} {name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserInfoWrapper>
  );
}

export default withRouter(UserInfo);
