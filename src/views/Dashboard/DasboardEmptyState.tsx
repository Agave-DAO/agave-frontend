import React, { MouseEventHandler } from "react";
import { Button, Center, CenterProps, Text } from "@chakra-ui/react";
import ColoredText from "../../components/ColoredText";
import { fontSizes, spacings } from "../../utils/constants";

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
      boxSizing="content-box"
      flexDirection="column"
      rounded="xl"
      minH="25.6rem"
      minW={{ base: "ineherit", lg: "inherit" }}
      flex={1}
      bg="primary.900"
      px={{ base: "2rem", md: "4rem" }}
      py="2.4rem"
      mr={{ base: "2.6rem" }}
      {...props}
    >
      <ColoredText
        fontSize={{ base: "1.6rem", md: "1.8rem" }}
        marginBottom={spacings.md}
        textAlign="center"
      >
        {type === EMPTY_TYPE.Deposit
          ? "No deposits yet"
          : "Nothing borrowed yet"}
      </ColoredText>
      <Button
        mt="2.4rem"
        textTransform="uppercase"
        background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
        color="secondary.900"
        fontWeight="bold"
        px={{ base: "10rem", md: "6rem" }}
        py="1.5rem"
        fontSize={fontSizes.md}
        onClick={onClick}
      >
        {type} now
      </Button>
    </Center>
  );
};
