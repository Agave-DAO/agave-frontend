import React from "react";
import { Center, useColorModeValue as mode } from "@chakra-ui/react";
import { useChainAddresses } from "../../../utils/chainAddresses";
import { UnsupportedChainIdError } from "@web3-react/core";
import { useAppWeb3 } from "../../../hooks/appWeb3";

export const CurrentChainBox: React.FC<{}> = () => {
  const chainAddresses = useChainAddresses();
  const { error } = useAppWeb3();
  return (
    <Center
      minWidth="12.5rem"
      height={{ base: "4rem", md: "3rem" }}
      fontSize="2xl"
      mx="0.5rem"
      px="0.5rem"
      color="white"
      bg={mode({ base: "secondary.800", md: "primary.500" }, "primary.500")}
      rounded="lg"
      fontWeight="400"
    >
      {error && error instanceof UnsupportedChainIdError
        ? `Invalid Chain`
        : `Chain: ${chainAddresses?.chainName}`}
    </Center>
  );
};
