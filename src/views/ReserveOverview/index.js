import React, { useState } from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import Graph from './Graph';
import ReserveInfo from './ReserveInfo';
import UserInfo from './UserInfo';

const ReserveOverviewWrapper = styled.div`
  .content-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .user-info {
      width: 440px;
      display: flex;
      flex-direction: column;
    }
  }
`;

function ReserveOverview() {  
  return (
    <Page>
      <ReserveOverviewWrapper>
        <Graph />
        <div className="content-wrapper">
          <ReserveInfo />
          <UserInfo />
        </div>
      </ReserveOverviewWrapper>
    </Page>
  );
}

export default ReserveOverview;
