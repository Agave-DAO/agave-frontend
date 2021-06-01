import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { BigNumberish } from "ethers";
import ColoredText from "../../components/ColoredText";
import ModalIcon from "../../components/ModalIcon";

type DepositDashProps = {
  agaveBalance?: BigNumberish; // IDK about this one, as this could be got by a hook as well.
  walletBalance?: BigNumberish; // Same as above. Please feel free to clean up if in case we have a hook :)
  healthFactor: number;
  utilRate: number;
  liquidityAvailable: BigNumberish;
  isCollateralized: boolean;
  maxLTV: number;
  assetPrice: BigNumberish;
  depositAPY: number;
};

const DepositDash: React.FC = () => {
  return (
    <VStack spacing="0" w="100%" bg="primary.900" rounded="lg">
      <HStack
        w="100%"
        justifyContent="flex-start"
        spacing="0"
        borderBottom="3px solid"
        borderBottomColor="primary.50"
        py="2.4rem"
        px="2.6rem"
      >
        <HStack spacing="1.3rem" mr="8.5rem">
          <Text fontSize="1.4rem">Your balance in Agave</Text>
          <Box>
            <Text display="inline-block" fontWeight="bold">
              3.37
            </Text>{" "}
            XDAI
          </Box>
        </HStack>
        <HStack spacing="1.3rem" mr="12.1rem !important" ml="0">
          <Text fontSize="1.4rem">Your wallet balance</Text>
          <Box>
            <Text display="inline-block" fontWeight="bold">
              4883.37
            </Text>{" "}
            XDAI
          </Box>
        </HStack>
        <HStack spacing="1.3rem">
          <Text fontSize="1.4rem">Health factor</Text>
          <ModalIcon position="relative" top="0" right="0" onOpen={() => {}} />
          <ColoredText fontSize="1.4rem">1.2</ColoredText>
        </HStack>
      </HStack>
      <HStack w="100%" py="2.4rem" px="2.6rem" justifyContent="space-between">
        <Stack justifyContent="flex-start">
          <Text fontSize="1.4rem">Utilization Rate</Text>
          <Text fontSize="1.7rem" fontWeight="bold">
            38.42%
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <Text fontSize="1.4rem">Available Liquidity</Text>
          <Text fontSize="1.7rem" fontWeight="bold">
            223,362,346.70 XDAI
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <Text fontSize="1.4rem">Deposit APY</Text>
          <Text fontSize="1.7rem" fontWeight="bold">
            11.07 %
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <Text fontSize="1.4rem">Can be used as collateral</Text>
          <Text fontSize="1.7rem" fontWeight="bold" color="yellow.100">
            Yes
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <HStack spacing="1rem">
            <Text fontSize="1.4rem">Maximum LTV</Text>
            <ModalIcon
              position="relative"
              top="0"
              right="0"
              onOpen={() => {}}
            />
          </HStack>
          <Text fontSize="1.7rem" fontWeight="bold">
            50%
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <Text fontSize="1.4rem">Asset price</Text>
          <Text fontSize="1.7rem" fontWeight="bold">
            $ 1.0003 USD
          </Text>
        </Stack>
      </HStack>
    </VStack>
  );
};

export default DepositDash;
