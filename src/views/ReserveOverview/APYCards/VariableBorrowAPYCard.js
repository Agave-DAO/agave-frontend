import React, { useState, useEffect } from "react";
import Card from "../../../components/Card";

function VariableBorrowAPYCard({ type }) {
  // Default Componate States
  const [borrowAPY, setborrowAPY] = useState("0");
  const [avg, setAvg] = useState("~");
  const [pct, setPct] = useState("0");

  // Update Componate States // TODO input real data
  useEffect(() => {
    setborrowAPY(13.22);
    setAvg("~");
    setPct(99.99);
  }, []);

  return (
    <Card color="green">
      <div className="apycard-title">Variable Borrowing</div>
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
            <span>Past 30D Avg.</span>
          </div>
          <div className="apycard-value">
            <span>{avg}</span>
          </div>
        </div>
        <div className="apycard-content-row">
          <div className="apycard-label">
            <span>% over total</span>
          </div>
          <div className="apycard-value">
            <span>{pct} %</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default VariableBorrowAPYCard;
