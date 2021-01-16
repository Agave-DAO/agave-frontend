import React from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import DepositInfo from './DepositInfo';
import BorrowInfo from './BorrowInfo';

const DashboardWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  .section-wrapper {
    width: calc(50% - 10px);
    display: flex;
    flex-direction: column;

    .section-header {
      background: ${props => props.theme.color.bgSecondary};
      .section-header-title {
        padding: 10px 0px 10px 20px;
        border-bottom: 2px solid ${props => props.theme.color.bgWhite};
        color: ${props => props.theme.color.textSecondary};
        font-size: 12px;
      }

      .section-header-content {
        display: flex;
        padding: 10px 20px;

        .section-body {
          margin-right: 40px;

          &:last-child {
            margin-right: 0;
          }

          .label {
            color: ${props => props.theme.color.textSecondary};
            font-size: 14px;
            font-weight: 300;
          }
  
          .value {
            color: ${props => props.theme.color.textSecondary};
            font-size: 12px;
  
            span {
              font-size: 14px;
              font-weight: bold;
  
              &.green {
                color: ${props => props.theme.color.green};
              }
            }
          }
        }
      }
    }

    .section-content {
      margin-top: 10px;
    }
  }
`;

function Dashboard() {
  return (
    <Page>
      <DashboardWrapper>
        <div className="section-wrapper">
          <div className="section-header">
            <div className="section-header-title">
              Deposit Information
            </div>
            <div className="section-header-content">
              <div className="section-body">
                <div className="label">
                  Aggregated balance
                </div>
                <div className="value">
                  $ <span>2,471.859</span> USD
                </div>
              </div>
            </div>
          </div>
          <div className="section-content">
            <DepositInfo />
          </div>
        </div>
        <div className="section-wrapper">
          <div className="section-header">
            <div className="section-header-title">
              Borrow Information
            </div>
            <div className="section-header-content">
              <div className="section-body">
                <div className="label">
                  You borrowed
                </div>
                <div className="value">
                  $ <span>102.13</span> USD
                </div>
              </div>
              <div className="section-body">
                <div className="label">
                  Your collateral
                </div>
                <div className="value">
                  $ <span>2425.27</span> USD
                </div>
              </div>
              <div className="section-body">
                <div className="label">
                  Health factor
                </div>
                <div className="value">
                  <span className="green">19.53</span>
                </div>
              </div>
            </div>
          </div>
          <div className="section-content">
            <BorrowInfo />
          </div>
        </div>
      </DashboardWrapper>
    </Page>
  );
}

export default Dashboard;
