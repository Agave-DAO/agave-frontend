import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { BigNumberish } from "ethers";
import ColoredText from "../../components/ColoredText";
import { fontSizes, spacings } from "../../utils/constants";
import { ModalIcon } from "../../utils/icons";

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

const DepositDash: React.FC<DepositDashProps> = ({
  agaveBalance,
  walletBalance,
  healthFactor,
  utilRate,
  liquidityAvailable,
  isCollateralized,
  maxLTV,
  assetPrice,
  depositAPY,
}) => {
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
        <HStack spacing={spacings.md} mr="8.5rem">
          <Text fontSize={fontSizes.md}>Your balance in Agave</Text>
          <Box>
            <Text display="inline-block" fontWeight="bold">
              {agaveBalance?.toLocaleString()}
            </Text>{" "}
            XDAI
          </Box>
        </HStack>
        <HStack spacing={spacings.md} ml="0">
          <Text fontSize={fontSizes.md}>Your wallet balance</Text>
          <Box>
            <Text display="inline-block" fontWeight="bold">
              {walletBalance?.toLocaleString()}
            </Text>{" "}
            XDAI
          </Box>
        </HStack>
        <Box w="12.1rem" />
        <HStack spacing={spacings.md}>
          <Text fontSize={fontSizes.md}>Health factor</Text>
          <ModalIcon position="relative" top="0" right="0" onOpen={() => {}} />
          <ColoredText fontSize={fontSizes.md}>{healthFactor}</ColoredText>
        </HStack>
      </HStack>
      <HStack w="100%" py="2.4rem" px="2.6rem" justifyContent="space-between">
        <Stack justifyContent="flex-start">
          <Text fontSize={fontSizes.md}>Utilization Rate</Text>
          <Text fontSize={fontSizes.xl} fontWeight="bold">
            {utilRate}
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <Text fontSize={fontSizes.md}>Available Liquidity</Text>
          <Text fontSize={fontSizes.xl} fontWeight="bold">
            {liquidityAvailable.toLocaleString()} XDAI
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <Text fontSize={fontSizes.md}>Deposit APY</Text>
          <Text fontSize={fontSizes.xl} fontWeight="bold">
            {depositAPY}
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <Text fontSize={fontSizes.md}>Can be used as collateral</Text>
          <Text fontSize={fontSizes.xl} fontWeight="bold" color="yellow.100">
            {isCollateralized ? "Yes" : "No"}
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <HStack spacing="1rem">
            <Text fontSize={fontSizes.md}>Maximum LTV</Text>
            <ModalIcon
              position="relative"
              top="0"
              right="0"
              onOpen={() => {}}
            />
          </HStack>
          <Text fontSize={fontSizes.xl} fontWeight="bold">
            {maxLTV.toLocaleString()}
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <Text fontSize={fontSizes.md}>Asset price</Text>
          <Text fontSize={fontSizes.xl} fontWeight="bold">
            $ {assetPrice.toLocaleString()} USD
          </Text>
        </Stack>
      </HStack>
    </VStack>
  );
};

export default DepositDash;
