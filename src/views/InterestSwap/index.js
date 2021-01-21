import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Page from '../../components/Page';
import InterestSwapConfirm from './InterestSwapConfirm';
import styled from 'styled-components';
import { marketData } from '../../utils/constants';

const InterestSwapWrapper = styled.div`
  height: calc(100% - 58px);
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
function InterestSwap({ match, history }) {
  const [asset, setAsset] = useState({});

  useEffect(() => {
    if (match.params && match.params.assetName) {
      setAsset(marketData.find(item => item.name === match.params.assetName));
    }
  }, [match]);

  return (
    <Page>
      <InterestSwapWrapper>
        <div className="topContent">
          <div className="topContent-title">
            Switch {asset.name} Interest Type
          </div>
        </div>
        <InterestSwapConfirm asset={asset} />
      </InterestSwapWrapper>
    </Page>
  );
}

export default compose(withRouter)(InterestSwap);
