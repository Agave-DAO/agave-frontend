import React, { useContext, useMemo } from "react";
import styled, { CSSProperties, ThemeContext } from "styled-components";
import { Link, LinkProps } from "react-router-dom";

const Button: React.FC<
  Omit<React.HTMLProps<HTMLDivElement>, "size"> & {
    text?: string;
    size?: string | "sm" | "md" | "lg" | number | undefined;
    to?: LinkProps["to"] | undefined;
    variant?: "secondary" | "outline" | "primary" | undefined;
  }
> = ({ children, disabled, href, onClick, size, text, to, variant }) => {
  const { color } = useContext(ThemeContext);

  let buttonColor;
  let borderColor;
  let backgroundColor;
  let boxShadow;
  let opacity;
  switch (variant) {
    case "secondary":
      buttonColor = color.white;
      borderColor = "transparent";
      backgroundColor = color.pink;
      boxShadow = `${color.pink} 0px 1px 3px 0px;`;
      opacity = "1";
      break;
    case "outline":
      buttonColor = color.grey[200];
      borderColor = "transparent";
      backgroundColor = "transparent";
      boxShadow = `none`;
      opacity = "0.8";
      break;
    case "primary":
    default:
      buttonColor = color.white;
      borderColor = "transparent";
      backgroundColor = color.bgSecondary;
      boxShadow = `none`;
      opacity = "1";
  }

  let width;
  let height;
  let fontSize;
  switch (size as "sm" | "md" | "lg" | number | undefined) {
    case "sm":
      width = 70;
      height = 24;
      fontSize = 10;
      break;
    case "lg":
      width = 120;
      height = 36;
      fontSize = 16;
      break;
    case "md":
    default:
      width = 100;
      height = 32;
      fontSize = 12;
  }

  const ButtonChild = useMemo(() => {
    if (to) {
      return <StyledLink to={to}>{text}</StyledLink>;
    } else if (href) {
      return (
        <StyledExternalLink href={href} target="__blank">
          {text}
        </StyledExternalLink>
      );
    } else {
      return text;
    }
  }, [href, text, to]);

  return (
    <StyledButton
      boxShadow={boxShadow}
      color={buttonColor}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      disabled={disabled}
      fontSize={fontSize}
      onClick={onClick}
      height={height}
      width={width}
      opacity={opacity}
    >
      {children}
      {ButtonChild}
    </StyledButton>
  );
};

const StyledButton = styled.div<
  { disabled?: boolean | undefined } & CSSProperties
>`
  background-color: ${(props) => props.backgroundColor};
  border: 1px solid transparent;
  border-radius: ${(props) => props.borderRadius};
  box-shadow: none;
  color: ${(props) => (!props.disabled ? props.color : `${props.color}55`)};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.fontSize}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  pointer-events: ${(props) => (!props.disabled ? undefined : "none")};
  transition: all 0.2s ease 0s;
  &:hover {
    box-shadow: ${(props) => props.boxShadow};
    border: 1px solid ${(props) => props.borderColor};
    opacity: ${(props) => props.opacity};
  }
`;

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  text-decoration: none;
`;

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  text-decoration: none;
`;

export default Button;
