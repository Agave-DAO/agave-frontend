import React, { useState, useEffect } from "react";
import Card from "../../../components/Card";

function StableBorrowAPYCard({ type }) {
  // Default Componate States
  const [borrowAPY, setborrowAPY] = useState("0");
  const [avg, setAvg] = useState("~");

  // Update Componate States // TODO input real data
  useEffect(() => {
    setborrowAPY(9.22);
    setAvg(0.08);
  }, []);

  return (
    <Card color="orange">
      <div className="apycard-title">Stable Borrowing</div>
      <div className="apycard-content">
        <div className="apycard-content-row">
          <div className="apycard-label">
            <span>Borrow APR</span>
          </div>
          <div className="apycard-value">
            <span>{borrowAPY} %</span>
          </div>
        </div>
        <div className="apycard-content-row">
          <div className="apycard-label">
            <span>% over total</span>
          </div>
          <div className="apycard-value">
            <span>{avg} %</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StableBorrowAPYCard;
