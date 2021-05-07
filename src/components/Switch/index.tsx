import React from "react";
import styled from "styled-components";

const SwitchWrapper = styled.div`
  width: 160px;
  min-height: 32px;
  border-radius: 1px;
  padding: 1px;
  position: relative;

  .labeled-switch-inner {
    background-color: ${props => props.theme.color.bgSecondary};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 1px;
    border-style: 1px solid ${props => props.theme.color.bgSecondary};

    .labeled-switch__pointer {
      transform: translateX(2px);
      content: "";
      position: absolute;
      left: 0px;
      top: 0px;
      width: 50%;
      height: 100%;
      transition: all 0.4s ease 0s;
      padding: 4px 2px;

      &.active {
        transform: translateX(78px);
      }

      span {
        background: ${props => props.theme.color.bgWhite};
        display: block;
        border-radius: 1px;
        width: 100%;
        height: 100%;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 5px 0px;
      }
    }

    .button {
      min-height: 30px;
      font-size: 11px;
      width: 50%;
      position: relative;
      z-index: 2;
      transition: all 0.4s ease 0s;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1px 2px 2px;
      cursor: pointer;
      color: ${props => props.theme.color.textSecondary};

      &.active {
        color: ${props => props.theme.color.black};
      }
    }
  }
`;

export function Switch<T>({
  values,
  activeValue,
  setActiveValue,
}: {
  values: [T, T];
  activeValue: T;
  setActiveValue: (active: T) => void;
}) {
  return (
    <SwitchWrapper>
      <div className="labeled-switch-inner">
        <div
          className={`labeled-switch__pointer ${
            activeValue === values[1] ? "active" : ""
          }`}
        >
          <span></span>
        </div>
        <div
          className={`button ${activeValue === values[0] ? "active" : ""}`}
          onClick={() => setActiveValue(values[0])}
        >
          {values[0]}
        </div>
        <div
          className={`button ${activeValue === values[1] ? "active" : ""}`}
          onClick={() => setActiveValue(values[1])}
        >
          {values[1]}
        </div>
      </div>
    </SwitchWrapper>
  );
}

export default Switch;
