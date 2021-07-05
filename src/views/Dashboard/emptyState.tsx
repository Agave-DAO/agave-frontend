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
  const renderType = React.useMemo(() => {
    return type === EMPTY_TYPE.Deposit ? "deposited" : "borrowed";
  }, [type]);

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
      <Text
        color="white"
        mt="0.5rem"
        fontWeight="400"
        fontSize="smaller"
        textAlign="center"
        mx={{ base: "1rem", md: "3rem" }}
      >
        There will be a list of all the assets you have {renderType}.
        For now, it’s empty since you have not {renderType}.
      </Text>
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
