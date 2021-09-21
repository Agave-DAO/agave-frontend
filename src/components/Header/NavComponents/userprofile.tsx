import React, { useMemo } from "react";
import {
  Text,
  Center,
  Badge,
  useColorModeValue as mode,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Stack,
  PopoverArrow,
} from "@chakra-ui/react";
import { bigNumberToString } from "../../../utils/fixedPoint";
import { useAmountAvailableToStake } from "../../../queries/amountAvailableToStake";
import { useAppWeb3 } from "../../../hooks/appWeb3";
import {  } from "@web3-react/injected-connector";

declare let window: any;

export const UserProfile: React.FC<{}> = () => {
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
  let chainName;

  switch(useAppWeb3().chainId){
    case 4:
      chainName = "Rinkeby";
      break;
    case 100:
      chainName = "xDai";
      break;
  }

  function changeId(chainId : Number) {
    try {
      switch(chainId){
        case 4:
          window.ethereum.request({
            id: 1,
            jsonrpc: '2.0',
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: '0x4',
              },
            ],
          })
          break;
        case 100:
          window.ethereum.request({
            id: 1,
            jsonrpc: '2.0',
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x64',
                chainName: 'xDAI Chain',
                rpcUrls: ['https://dai.poa.network'],
                iconUrls: [
                  'https://xdaichain.com/fake/example/url/xdai.svg',
                  'https://xdaichain.com/fake/example/url/xdai.png',
                ],
                nativeCurrency: {
                  name: 'xDAI',
                  symbol: 'xDAI',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://blockscout.com/poa/xdai/'],
              },
            ],
          })
          break;
      }
    } catch {
      console.error("Chain ID change failed")
    }
  }

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

      
      <Popover>
        <PopoverTrigger>
          <Button
            minWidth="14rem"
            height={{ base: "4rem", md: "3rem" }}
            fontSize={{ base: "4xl", md: "2xl" }}
            mx="1.5rem"
            px="1.5rem"
            pt="4px"
            color="white"
            bg={mode({ base: "secondary.800", md: "primary.500" }, "primary.500")}
            rounded="lg"
          >
            {useAppWeb3().chainId ? <Text fontWeight="400">Chain: {chainName}</Text> : <Text fontWeight="400">Invalid Chain</Text>}
            
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          bg={mode({ base: "primary.900", md: "primary.900" }, "primary.900")}
          color="white"
          borderColor={mode({ base: "primary.50", md: "primary.50" }, "primary.50")}
        >
          <PopoverArrow />
          <PopoverHeader
            borderColor={mode({ base: "primary.50", md: "primary.50" }, "primary.50")}
          >
            Current Chain: {chainName}
          </PopoverHeader>

          <PopoverBody>
          <Stack spacing={4} direction="column">
            <Button 
              bg={mode({ base: "primary.500", md: "primary.500" }, "primary.500")}
              colorScheme="teal"
              size="lg"
              onClick={() => changeId(100)}
            >
              xDai
            </Button>
            <Button
              bg={mode({ base: "primary.500", md: "primary.500" }, "primary.500")}
              colorScheme="teal"
              size="lg"
              onClick={() => changeId(4)}
            >
              Rinkeby
            </Button>
          </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      
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
        <Text fontSize={{ base: "4xl", md: "2xl" }}>{addressPretty}</Text>
      </Center>
    </>
  );
};
