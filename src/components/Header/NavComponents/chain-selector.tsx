import React, { ReactElement, useMemo } from "react";
import {
  Text,
  useColorModeValue as mode,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Stack,
  PopoverArrow,
} from "@chakra-ui/react";
import { useChainAddresses } from "../../../utils/chainAddresses";
import { changeChain } from "../../../utils/changeChain";
import { internalAddressesPerNetworkId } from "../../../utils/contracts/contractAddresses/internalAddresses";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

export const ChainSelector: React.FC<{}> = () => {
  const chainAddresses = useChainAddresses();
  const { error } = useWeb3React();

  // Buttons to change to every available chain
  const popoverData = useMemo(
    () =>
      Object.entries(internalAddressesPerNetworkId).map(([id, chain]) => {
        return (
          <Button
            bg={mode({ base: "primary.500", md: "primary.500" }, "primary.500")}
            colorScheme="teal"
            size="xl"
            h="40px"
            onClick={() => changeChain(chain.chainName)}
          >
            {chain.chainName}
          </Button>
        );
      }),
    []
  );

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          minWidth="9rem"
          height={{ base: "4rem", md: "3rem" }}
          fontSize={{ base: "4xl", md: "2xl" }}
          mx="1.5rem"
          px="1.5rem"
          pt={{ base: "0px", md: "4px" }}
          color="white"
          bg={mode({ base: "secondary.800", md: "primary.500" }, "primary.500")}
          rounded="lg"
        >
          {error && error instanceof UnsupportedChainIdError ? (
            <Text fontWeight="400">Invalid Chain</Text>
          ) : (
            <Text fontWeight="400">Chain: {chainAddresses?.chainName}</Text>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        bg={mode({ base: "primary.900", md: "primary.900" }, "primary.900")}
        color="white"
        borderColor={mode(
          { base: "primary.50", md: "primary.50" },
          "primary.50"
        )}
      >
        <PopoverArrow
          bg="#007c6e"
          color="white"
          border="0px"
          boxShadow="-1px -1px 1px 0px #36cfa2 !important"
          borderColor={mode(
            { base: "primary.50", md: "primary.50" },
            "primary.50"
          )}
        />
        <PopoverBody>
          <Stack spacing={4} direction="column">
            {popoverData}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
