import React from "react";
import styled from "styled-components";
import { IMarketData } from "../../utils/constants";

const AssetAmountWrapper = styled.div`
  margin-bottom: 20px;
  width: 100%;
  border: 1px solid ${props => props.theme.color.textPrimary};
  padding: 15px;
  border-radius: 2px;
  display: flex;
  justify-content: space-between;

  .content-label {
    font-weight: 400;
    color: ${props => props.theme.color.textPrimary};
  }

  .content-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .token-amount {
      display: flex;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }

      span {
        font-size: 16px;
      }
    }

    .usd-amount {
      font-size: 10px;
    }
  }
`;

export interface AssetAmountProps {
  asset: IMarketData | undefined;
  amount: number;
}

export const AssetAmount: React.FC<AssetAmountProps> = ({ asset, amount }) => {
  return (
    <AssetAmountWrapper>
      <div className="content-label">Amount</div>
      {asset ? (
        <div className="content-value">
          <div className="token-amount">
            <img src={asset.img} alt="" />
            <span>
              {amount} {asset.name}
            </span>
          </div>
          <div className="usd-amount">$ {asset.asset_price * amount}</div>
        </div>
      ) : (
        <></>
      )}
    </AssetAmountWrapper>
  );
};
