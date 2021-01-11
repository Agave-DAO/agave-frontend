import React, { useState } from 'react';
import Page from '../../components/Page';
import Switch from '../../components/Switch';
import MarketTable from './MarketTable';
import styled from 'styled-components';

const MarketsWrapper = styled.div`
  .topContent {
    width: 100%;
    border-radius: ${props => props.theme.color.borderRadius}px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px 0px;
    position: relative;
    background-color: ${props => props.theme.color.grey[100]};
    color: rgb(255, 255, 255);
    padding: 15px 50px;
    display: flex;
    flex-direction: column;

    span {
      display: block;
      width: fit-content;
      font-size: 35px;
      font-weight: 800;
      background: -webkit-linear-gradient(180deg, ${props => props.theme.color.pink} 0%, ${props => props.theme.color.blue} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-text-stroke-width: 0.3px;
      -webkit-text-stroke-color: rgb(255, 255, 255);
    }
  }

  .price-switcher {
    margin: 20px 0px 5px;

    .labeled-switch {
      width: 160px;
      min-height: 32px;
      border-radius: 1px;
      padding: 1px;
      position: relative;

      .labeled-switch-inner {
        background-color: ${props => props.theme.color.grey[100]};
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-radius: 1px;
        border-style: 1px solid ${props => props.theme.color.grey[100]};

        .labeled-switch__pointer {
          transform: translateX(2px);
          content: "";
          position: absolute;
          left: 0px;
          top: 0px;
          width: 50%;
          height: 100%;
          transition: all 0.4s ease 0s;
          padding: 4px 2px;

          &.active {
            transform: translateX(78px);
          }

          span {
            background: rgb(255, 255, 255);
            display: block;
            border-radius: 1px;
            width: 100%;
            height: 100%;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 5px 0px;
          }
        }

        .button {
          min-height: 30px;
          font-size: 11px;
          width: 50%;
          position: relative;
          z-index: 2;
          transition: all 0.4s ease 0s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1px 2px 2px;
          cursor: pointer;
          color: rgb(255, 255, 255);

          &.active {
            color: ${props => props.theme.color.black};
          }
        }
      }
    }
  }
`;

function Markets() {
  const [activeValue, setActiveValue] = useState('USD');
  return (
    <Page>
      <MarketsWrapper>
        <div className="topContent">
          <div>Current Market Size</div>
          <span>$ 97,827,149.29</span>
        </div>
        <div className="price-switcher">
          <Switch values={['USD', 'Native']} activeValue={activeValue} setActiveValue={setActiveValue} />
        </div>
        <MarketTable activePrice={activeValue} />
      </MarketsWrapper>
    </Page>
  );
}

export default Markets;
