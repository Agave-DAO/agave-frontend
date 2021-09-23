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
  PopoverBody,
  Stack,
  PopoverArrow,
} from "@chakra-ui/react";
import { bigNumberToString } from "../../../utils/fixedPoint";
import { useAmountAvailableToStake } from "../../../queries/amountAvailableToStake";
import { useAppWeb3 } from "../../../hooks/appWeb3";
import { useChainAddresses } from "../../../utils/chainAddresses";
import { internalAddressesPerNetworkId, } from "../../../utils/contracts/contractAddresses/internalAddresses";

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

  const chainAddresses = useChainAddresses();

  // internalAddressesPerNetworkId cannot be indexed for each chain, strigified and parsed back to index
  var chains =  JSON.parse(JSON.stringify(internalAddressesPerNetworkId))

  // Buttons to change to every available chain
  let buttons : any[] = [];
  Object.entries(internalAddressesPerNetworkId).forEach(([name, chain]) => {
    buttons.push(
      <Button 
        bg={mode({ base: "primary.500", md: "primary.500" }, "primary.500")}
        colorScheme="teal"
        size="xl"
        h="40px"
        onClick={() => changeId(chain.chainId)}
      >
        {chain.chainName}
      </Button>
  )})

  const currChainName : String = chains[chainAddresses?.chainId || 0]?.chainName

  // Request wallet provider to change chain
  // TODO: change it to enother file
  function changeId(chainId: number) {
    const chain = chains[chainId.toString()]
    try {
      switch(chainId){
        // If the chain is default to Metamask if will use wallet_switchEthereumChain
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
        default:
          window.ethereum.request({
            id: 1,
            jsonrpc: '2.0',
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: "0x" + chain.chainId.toString(16),
                chainName: chain.chainName,
                rpcUrls: [chain.rpcUrl],
                nativeCurrency: {
                  name: chain.symbol,
                  symbol: chain.symbol,
                  decimals: 18,
                },
                blockExplorerUrls: [chain.explorer],
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
            {useAppWeb3().chainId ? <Text fontWeight="400">Chain: {currChainName}</Text> : <Text fontWeight="400">Invalid Chain</Text>}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          bg={mode({ base: "primary.900", md: "primary.900" }, "primary.900")}
          color="white"
          borderColor={mode({ base: "primary.50", md: "primary.50" }, "primary.50")}
        >
          <PopoverArrow 
            bg="#007c6e"
            color="white"
            border="0px"
            boxShadow="-1px -1px 1px 0px #36cfa2 !important"
            borderColor={mode({ base: "primary.50", md: "primary.50" }, "primary.50")}
          />
          <PopoverBody>
          <Stack spacing={4} direction="column">
            {buttons}
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
        <Text fontSize={{ base: "2xl", md: "2xl" }}>{addressPretty}</Text>
      </Center>
    </>
  );
};
