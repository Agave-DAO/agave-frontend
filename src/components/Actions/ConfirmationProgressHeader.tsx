import React from "react";
import styled from "styled-components";

const ConfirmationProgressHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flexdirection: row;

  .form-action-step {
    flex: 1 1 0%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(241, 241, 243);
    color: ${props => props.theme.color.textPrimary};
    font-size: 12px;

    &:not(:last-child) {
      border-right: 1px solid white;
    }

    span {
      font-size: 12px;
      font-weight: 600;
      margin-right: 5px;
    }

    &.active {
      color: white;
      font-size: 12px;
      background: ${props => props.theme.color.bgSecondary};
    }

    &.success {
      color: white;
      font-size: 12px;
      background: ${props => props.theme.color.green};
    }
  }
`;

export interface ConfirmationProgressHeaderProps {
  step: number;
  labels: string[];
}

export const ConfirmationProgressHeader: React.FC<ConfirmationProgressHeaderProps> =
  ({ step, labels }) => {
    const maxStep = labels.length;
    return (
      <ConfirmationProgressHeaderWrapper>
        {labels.map((label, idx) => (
          <div
            className={`form-action-step ${
              step === maxStep ? "success" : step > idx ? "active" : ""
            }`}
          >
            <span>{idx + 1}</span> {label}
          </div>
        ))}
      </ConfirmationProgressHeaderWrapper>
    );
  };
