import React, { useState } from 'react';
import Page from '../../components/Page';
import Switch from '../../components/Switch';
import DepositTable from './DepositTable';
import styled from 'styled-components';

const DepositWrapper = styled.div`
  .topContent {
    margin-bottom: 30px;

    .topContent-title {
      font-size: 16px;
      font-weight: 400;
      line-height: 1;
      padding-bottom: 10px;
      color: ${props => props.theme.color.textSecondary};
      border-bottom: 2px solid ${props => props.theme.color.white};
    }
  }

  .price-switcher {
    margin: 20px 0px 5px;
  }
`;

function Deposit() {
  const [activeValue, setActiveValue] = useState<"All" | "Stable Coins">('All');
  return (
    <Page>
      <DepositWrapper>
        <div className="topContent">
          <div className="topContent-title">Deposit</div>
        </div>
        <div className="price-switcher">
          <Switch values={['All', 'Stable Coins']} activeValue={activeValue} setActiveValue={setActiveValue} />
        </div>
        <DepositTable activeType={activeValue} />
      </DepositWrapper>
    </Page>
  );
}

export default Deposit;
