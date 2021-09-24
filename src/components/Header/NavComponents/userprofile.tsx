import React, { useMemo, useState } from "react";
import {
  Text,
  Center,
  Badge,
  useColorModeValue as mode,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Stack,
  PopoverArrow,
  Heading,
} from "@chakra-ui/react";
import { bigNumberToString } from "../../../utils/fixedPoint";
import { useAmountAvailableToStake } from "../../../queries/amountAvailableToStake";
import { useAppWeb3 } from "../../../hooks/appWeb3";
import { useChainAddresses } from "../../../utils/chainAddresses";
import { changeChain } from "../../../utils/changeChain";
import { internalAddressesPerNetworkId } from "../../../utils/contracts/contractAddresses/internalAddresses";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import {
  frameConnector,
  injectedConnector,
  walletConnectConnector,
} from "../../../hooks/injectedConnectors";

export const UserProfile: React.FC<{}> = () => {
  const [connector, setConnector] = useState("");

  injectedConnector
    .getAccount()
    .then((res: any) => {
      setConnector("metamask");
    })
    .catch((err: any) => {});
  walletConnectConnector
    .getAccount()
    .then((res: any) => {
      setConnector("walletconnect");
    })
    .catch((err: any) => {});
  frameConnector
    .getAccount()
    .then((res: any) => {
      setConnector("frame");
    })
    .catch((err: any) => {});
  // Light/Dark button functions
  // const { colorMode, toggleColorMode } = useColorMode();

  // Address button functions
  const address: string | undefined = useAppWeb3().account ?? undefined;
  const addressPretty = useMemo(
    () =>
      address
        ? `${address.substring(0, 4)}...${address.substring(
            address.length - 4,
            address.length
          )}`
        : "Not Connected",
    [address]
  );

  // Agve button functions
  const { data: agaveBalance } = useAmountAvailableToStake(address);
  const userBal = agaveBalance ? bigNumberToString(agaveBalance, 3) : "0";

  const chainAddresses = useChainAddresses();
  const { error } = useWeb3React();

  // Buttons to change to every available chain
  let popoverData: any[] = [];
  Object.entries(internalAddressesPerNetworkId).forEach(([name, chain]) => {
    var entry: any;
    if (connector === "metamask") {
      entry = (
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
      popoverData.push(entry);
    } else if (connector !== "") {
      entry = (
        <Heading as="h5" size="lg" h="40px" py="4%" px="10%">
          {chain.chainName + ": " + chain.chainId}
        </Heading>
      );
      popoverData.push(entry);
    }
  });

  const currChainName = chainAddresses?.chainName;

  return (
    <>
      {/* NIGHTMODE 
      <Center
        width={{ base: "4rem", md: "3rem" }}
        height={{ base: "4rem", md: "3rem" }}
        rounded="lg"
        bg={mode({ base: "primary.800", md: "primary.500" }, "primary.500")}
        cursor="pointer"
        onClick={toggleColorMode}
      >
        <Image
          src={colorMode === "dark" ? darkMoon : lightMoon}
          alt="theme-mode"
        />
        
    </Center>*/}
      <Center
        minWidth="10rem"
        height={{ base: "4rem", md: "3rem" }}
        fontSize={{ base: "4xl", md: "2xl" }}
        mx="1.5rem"
        textTransform="uppercase"
        color="white"
        bg={mode({ base: "secondary.800", md: "primary.500" }, "primary.500")}
        rounded="lg"
        px="5px"
        mr="2px"
      >
        <Text mr="5px">{userBal}</Text>
        <Text fontWeight="400">AGVE</Text>
      </Center>
      {connector !== "" ? (
        connector === "metamask" ? (
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
                bg={mode(
                  { base: "secondary.800", md: "primary.500" },
                  "primary.500"
                )}
                rounded="lg"
              >
                {error && error instanceof UnsupportedChainIdError ? (
                  <Text fontWeight="400">Invalid Chain</Text>
                ) : (
                  <Text fontWeight="400">Chain: {currChainName}</Text>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              bg={mode(
                { base: "primary.900", md: "primary.900" },
                "primary.900"
              )}
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
        ) : (
          <Center
            minWidth="12rem"
            height={{ base: "4rem", md: "3rem" }}
            fontSize={{ base: "4xl", md: "2xl" }}
            mx="1.5rem"
            px="1rem"
            color="white"
            bg={mode(
              { base: "secondary.800", md: "primary.500" },
              "primary.500"
            )}
            rounded="lg"
          >
            {error && error instanceof UnsupportedChainIdError ? (
              <Text fontWeight="400">Invalid Chain</Text>
            ) : (
              <Text fontWeight="400">Chain: {currChainName}</Text>
            )}
          </Center>
        )
      ) : (
        <></>
      )}

      <Center
        background={mode(
          { base: "secondary.800", md: "primary.500" },
          "primary.500"
        )}
        rounded="lg"
        minWidth="14rem"
        height={{ base: "4rem", md: "3rem" }}
        color="white"
        p="10px"
      >
        <Badge
          bg="yellow"
          rounded="full"
          width={{ base: "1.3rem", md: "1rem" }}
          height={{ base: "1.3rem", md: "1rem" }}
          mr="5px"
        />
        <Text fontSize={{ base: "2xl", md: "2xl" }}>{addressPretty}</Text>
      </Center>
    </>
  );
};
