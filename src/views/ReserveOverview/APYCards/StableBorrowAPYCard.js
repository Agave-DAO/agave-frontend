import React from 'react';
import Card from '../../../components/Card';

function StableBorrowAPYCard({type}) {
  return (
    <Card color="pink">
      <div className="apycard-title">
        Stable Borrowing
      </div>
      <div className="apycard-content">
        <div className="apycard-content-row">
          <div className="apycard-label">
            <span>Borrow APR</span>
          </div>
          <div className="apycard-value">
            <span>9.22 %</span>
          </div>
        </div>
        <div className="apycard-content-row">
          <div className="apycard-label">
            <span>% over total</span>
          </div>
          <div className="apycard-value">
            <span>0.08 %</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StableBorrowAPYCard;
