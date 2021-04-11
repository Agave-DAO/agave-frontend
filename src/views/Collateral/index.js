import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Page from '../../components/Page';
import CollateralConfirm from './CollateralConfirm';
import styled from 'styled-components';
import { marketData } from '../../utils/constants';

const CollateralWrapper = styled.div`
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
function Collateral({ match, history }) {
  const [asset, setAsset] = useState({});

  useEffect(() => {
    if (match.params && match.params.assetName) {
      setAsset(marketData.find(item => item.name === match.params.assetName));
    }
  }, [match]);

  return (
    <Page>
      <CollateralWrapper>
        <div className="topContent">
          <div className="topContent-title">
            {asset.collateral ? `Do not use ${asset.name} as collateral` : `Use ${asset.name} as collateral`}
          </div>
        </div>
        <CollateralConfirm asset={asset} />
      </CollateralWrapper>
    </Page>
  );
}

export default withRouter(Collateral);
