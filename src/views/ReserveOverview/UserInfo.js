import React, { useState } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';

const UserInfoWrapper = styled.div`
  width: 440px;
  display: flex;
  flex-direction: column;

  .userinfo-title {
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 400;
    width: 100%;
  }

  .userinfo-content {
    position: relative;
    width: 100%;

    .userinfo-wrapper {
      background: ${props => props.theme.color.bgWhite};
      padding: 15px;
      margin-bottom: 15px;
      position: relative;
      box-shadow: ${props => props.theme.color.boxShadow};

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
          }

          .userinfo-wrapper-content-value {
            font-size: 14px;
            font-weight: 400;

            &.green {
              color: ${props => props.theme.color.green};
            }
          }
        }
      }
    }
  }
`;

function UserInfo({ asset, history }) {
  return (
    <UserInfoWrapper>
      <div className="userinfo-title">
        Your information
      </div>
      <div className="userinfo-content">
        <div className="userinfo-wrapper">
          <div className="userinfo-wrapper-top">
            <span>Deposits</span>
            <div className="userinfo-wrapper-top-buttons">
              <Button size="sm" variant="primary" onClick={() => history.push(`/deposit/${asset.name}`)}>
                Deposit
              </Button>
              <Button size="sm" variant="outline" onClick={() => history.push(`/withdraw/${asset.name}`)}>
                Withdraw
              </Button>
            </div>
          </div>
          <div className="userinfo-wrapper-content">
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                Your wallet balance
              </div>
              <div className="userinfo-wrapper-content-value">
                {asset.wallet_balance} {asset.name}
              </div>
            </div>
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                You already deposited
              </div>
              <div className="userinfo-wrapper-content-value">
              {asset.supply_balance} {asset.name}
              </div>
            </div>
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                Use as collateral
              </div>
              <div className="userinfo-wrapper-content-value green">
                <CheckBox isChecked={asset.collateral} handleChange={() => { history.push(`/collateral/${asset.name}`)}} />
              </div>
            </div>
          </div>
        </div>
        <div className="userinfo-wrapper">
          <div className="userinfo-wrapper-top">
            <span>Borrows</span>
            <div className="userinfo-wrapper-top-buttons">
              <Button size="sm" variant="primary" onClick={() => history.push(`/borrow/${asset.name}`)}>
                Borrow
              </Button>
            </div>
          </div>
          <div className="userinfo-wrapper-content">
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                Borrowed
              </div>
              <div className="userinfo-wrapper-content-value">
                {asset.borrow_balance} {asset.name}
              </div>
            </div>
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                Health factor
              </div>
              <div className="userinfo-wrapper-content-value green">
                21.06
              </div>
            </div>
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                Loan to value
              </div>
              <div className="userinfo-wrapper-content-value">
                78.64 %
              </div>
            </div>
            <div className="userinfo-wrapper-content-row">
              <div className="userinfo-wrapper-content-label">
                Available to you
              </div>
              <div className="userinfo-wrapper-content-value">
                1904.52 {asset.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserInfoWrapper>
  );
}

export default compose(withRouter)(UserInfo);
