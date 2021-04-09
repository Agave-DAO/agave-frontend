import React, { useState } from 'react';
import Page from '../../components/Page';
import Switch from '../../components/Switch';
import BorrowTable from './BorrowTable';
import styled from 'styled-components';

const BorrowWrapper = styled.div`
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

function Borrow() {
  const [activeValue, setActiveValue] = useState('All');
  return (
    <Page>
      <BorrowWrapper>
        <div className="topContent">
          <div className="topContent-title">Borrow</div>
        </div>
        <div className="price-switcher">
          <Switch values={['All', 'Stable Coins']} activeValue={activeValue} setActiveValue={setActiveValue} />
        </div>
        <BorrowTable activeType={activeValue} />
      </BorrowWrapper>
    </Page>
  );
}

export default Borrow;
