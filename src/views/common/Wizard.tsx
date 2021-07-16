import React from "react";
import { VStack } from "@chakra-ui/layout";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";
import { Box, Center, HStack, Text } from "@chakra-ui/react";
import ColoredText from "../../components/ColoredText";
import { BigNumber } from "ethers";
// import { TransactionLog } from "../common/TransactionLog";
import { ModalIcon, TokenIcon } from "../../utils/icons";
import { fontSizes, LINEAR_GRADIENT_BG } from "../../utils/constants";
import { bigNumberToString } from "../../utils/fixedPoint"
import { useAppWeb3 } from "../../hooks/appWeb3";
import { useUserAccountData } from "../../queries/userAccountData";

export const WizardOverviewWrapper: React.FC<{
  title: string;
  asset: ReserveTokenDefinition;
  amount: BigNumber;
}> = ({ title, asset, amount, children }) => {
  const { account: userAccountAddress } = useAppWeb3();
  const currentHealthFactor = useUserAccountData(
    userAccountAddress ?? undefined
  )?.data?.healthFactor;

  const infoBox = React.useMemo(
    () => (
      <VStack
        spacing=".5rem"
        p="1.5rem"
        w={{base:'30rem', md:'45rem'}}
        background="secondary.900"
        rounded="lg"
        alignItems="space-between"
      >
        <HStack justifyContent="space-between">
          <Text lineHeight={fontSizes.md} fontSize={{base:fontSizes.sm, md:fontSizes.md}}>
            Amount
          </Text>
          <HStack>
            <TokenIcon
              symbol={asset.symbol}
              boxSize={{ base: "1.5rem", md: "1.8rem" }}
            />
            <Text fontSize={{base:fontSizes.sm, md:fontSizes.md}}>
              {bigNumberToString(amount)} {asset.symbol}
            </Text>
          </HStack>
        </HStack>
        <HStack justifyContent="space-between">
          <HStack spacing=".2rem">
            <Text lineHeight={fontSizes.md} fontSize={{base:fontSizes.sm, md:fontSizes.md}}>
              Current health factor
            </Text>
            <ModalIcon
              onOpen={() => {}}
              position="relative"
              top="0"
              right="0"
              margin="0"
              transform="scale(0.75)"
            />
          </HStack>
          <ColoredText
            fontSize={{base:fontSizes.sm, md:fontSizes.md}}
            overflow="hidden"
            overflowWrap="normal"
          >
            {bigNumberToString(currentHealthFactor)}
          </ColoredText>
        </HStack>
        {/* Calculating this is hard - do it later */}
        {/* <HStack justifyContent="space-between">
          <Text lineHeight={fontSizes.md} fontSize="1rem">
            Next health factor
          </Text>
          <ColoredText fontSize="1.2rem">(Unimplemented)</ColoredText>
        </HStack> */}
      </VStack>
    ),
    [asset.symbol, amount, currentHealthFactor]
  );

  return (
    <VStack w="95%" spacing="0" p="1rem 2rem">
      <ColoredText textTransform="capitalize" fontSize={{base:fontSizes.lg, md:fontSizes.xl, lg:fontSizes.xxl}}>
        {title}
      </ColoredText>
      <Box h="1.3rem" />
      <Text fontSize={{base:fontSizes.md, md:fontSizes.lg, lg:fontSizes.lg}} textAlign="center">
        These are your transaction details. <br/> Please verify them before submitting.
      </Text>
      <Box h={fontSizes.xl} />
      {infoBox}
      <Box h={fontSizes.md} />
      <VStack
        w={{base:'30rem', md:'45rem'}}
        minH="8rem"
        bg="secondary.900"
        rounded="lg"
        overflow="hidden"
      >
        {children}
        {/* {stepLogsArr.reverse().map(log => {
          return <TransactionLog log={log} />;
        })} */}
      </VStack>
    </VStack>
  );
};

export const StepperBar: React.FC<{
  states: ReadonlyArray<string>;
  stateNames: Readonly<Record<string, string>>;
  currentState: string;
}> = ({ states, currentState, stateNames }) => {
  return (
    <HStack w="100%" spacing="0">
      {states.map((step, index) => (
        <Center
          key={step}
          flex={1}
          background={
            step === currentState ? LINEAR_GRADIENT_BG : "primary.300"
          }
          color="secondary.900"
          fontSize={{base:fontSizes.xs, md:fontSizes.sm}}
          padding=".3rem"
        >
          {index + 1} {stateNames[step]}
        </Center>
      ))}
    </HStack>
  );
};
