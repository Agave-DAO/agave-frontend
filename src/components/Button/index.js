import React, { useContext, useMemo } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  disabled,
  href,
  onClick,
  size,
  text,
  to,
  variant,
}) => {
  const { color } = useContext(ThemeContext);

  let buttonColor;
  let backgroundColor;
  let boxShadow;
  switch (variant) {
    case 'secondary':
      buttonColor = color.white;
      backgroundColor = color.pink;
      boxShadow = `${color.pink} 0px 1px 3px 0px;`
      break;
    case 'outline':
      buttonColor = color.grey[200];
      backgroundColor = 'transparent';
      boxShadow = `${color.pink} 0px 1px 3px 0px;`
      break;
    case 'default':
    default:
      buttonColor = color.white;
      backgroundColor = color.grey[200];
      boxShadow = `${color.grey[200]} 0px 1px 3px 0px;`
  }

  let width;
  let height;
  let fontSize;
  switch (size) {
    case 'sm':
      width = 70;
      height = 24;
      fontSize = 10;
      break
    case 'lg':
      width = 120;
      height = 36;
      fontSize = 16;
      break
    case 'md':
    default:
      width = 100;
      height = 32;
      fontSize = 12;
  }

  const ButtonChild = useMemo(() => {
    if (to) {
      return <StyledLink to={to}>{text}</StyledLink>
    } else if (href) {
      return <StyledExternalLink href={href} target="__blank">{text}</StyledExternalLink>
    } else {
      return text
    }
  }, [href, text, to])

  return (
    <StyledButton
      boxShadow={boxShadow}
      color={buttonColor}
      backgroundColor={backgroundColor}
      disabled={disabled}
      fontSize={fontSize}
      onClick={onClick}
      height={height}
      width={width}
    >
      {children}
      {ButtonChild}
    </StyledButton>
  )
}

const StyledButton = styled.button`
  background-color: ${props => props.backgroundColor};
  border: 0;
  border-radius: ${props => props.borderRadius};
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px 0px;
  color: ${props => !props.disabled ? props.color : `${props.color}55`};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.fontSize}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  pointer-events: ${props => !props.disabled ? undefined : 'none'};
  transition: all 0.2s ease 0s;
  &:hover {
    box-shadow: ${props => props.boxShadow};
  }
`

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  text-decoration: none;
`

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  text-decoration: none;
`

export default Button