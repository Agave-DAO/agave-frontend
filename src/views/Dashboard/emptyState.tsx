import React, { MouseEventHandler } from "react";
import { Button, Center, CenterProps } from "@chakra-ui/react";
import ColoredText from "../../components/ColoredText";
import { fontSizes } from "../../utils/constants";
import { isDesktop } from "react-device-detect";

export const EMPTY_TYPE = {
  Deposit: "Deposit",
  Borrow: "Borrow",
};

export const DashboardEmptyState: React.FC<{
  type: string;
  onClick: MouseEventHandler;
  props?: CenterProps;
}> = ({ type, onClick, ...props }) => {
  return (
    <Center
      w={isDesktop ? "49%" : "100%"}
      boxSizing="content-box"
      flexDirection="column"
      rounded="xl"
      float="left"
      minH="25.6rem"
      bg="primary.900"
      px={{ base: "0rem", md: "0rem" }}
      py="2.4rem"
      marginRight={type === "Deposit" && isDesktop ? "2%" : "0%"}
      marginBottom={type === "Deposit" && isDesktop ? "0%" : "2rem"}
      {...props}
    >
      <ColoredText
        fontSize={{ base: "1.6rem", md: "1.8rem" }}
        textAlign="center"
      >
        {type === EMPTY_TYPE.Deposit
          ? "No deposits yet"
          : "Nothing borrowed yet"}
      </ColoredText>
      <Button
        textTransform="uppercase"
        background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
        color="secondary.900"
        fontWeight="bold"
        px={{ base: "10rem", md: "6rem" }}
        py="1.5rem"
        fontSize={fontSizes.md}
        onClick={onClick}
        mt="2rem"
      >
        {type} now
      </Button>
    </Center>
  );
};
