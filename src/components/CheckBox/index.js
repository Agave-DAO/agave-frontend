import React from "react";
import styled from 'styled-components';
import Switch from "react-switch";

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;

  span {
    font-size: 12px;
    font-weight: 400;
    margin-right: 5px;

    &.green {
      color: ${props => props.theme.color.green};
    }

    &.red {
      color: ${props => props.theme.color.red};
    }
  }

  .react-switch-bg {
    background: ${props => !props.isChecked ? props.theme.color.red + ' !important' : ''};
  }
`;

function CheckBox({ isChecked, handleChange }) {
  return (
    <CheckBoxWrapper isChecked={isChecked}>
      <span className={isChecked ? 'green' : 'red'}>{isChecked ? 'Yes' : 'No'}</span>
      <Switch
        checked={isChecked}
        onChange={handleChange}
        onColor="#79C982"
        onHandleColor="#ffffff"
        handleDiameter={14}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="none"
        height={16}
        width={32}
        className="react-switch"
        id="material-switch"
      />
    </CheckBoxWrapper>
  );
}

export default CheckBox;
