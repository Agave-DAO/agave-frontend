import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Page from '../../components/Page';
import Graph from './Graph';
import ReserveInfo from './ReserveInfo';
import UserInfo from './UserInfo';
import { marketData } from '../../utils/constants';

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

function ReserveOverview({ match, history }) {
  const [asset, setAsset] = useState({});

  useEffect(() => {
    if (match.params && match.params.assetName) {
      setAsset(marketData.find(item => item.name === match.params.assetName));
    }
  }, [match]);

  return (
    <Page>
      <ReserveOverviewWrapper>
        <Graph />
        <div className="content-wrapper">
          <ReserveInfo asset={asset} />
          <UserInfo asset={asset} />
        </div>
      </ReserveOverviewWrapper>
    </Page>
  );
}

export default compose(withRouter)(ReserveOverview);
