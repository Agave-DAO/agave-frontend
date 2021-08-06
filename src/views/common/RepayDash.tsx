import {
  Box,
  HStack,
  Stack,
  Text,
  VStack,
  useMediaQuery,
  Flex,
  Popover,
  PopoverBody,
  PopoverTrigger,
  PopoverContent,
  Grid,
} from "@chakra-ui/react";
import { BigNumber, constants } from "ethers";
import { bigNumberToString } from "../../utils/fixedPoint";
import React from "react";
import ColoredText from "../../components/ColoredText";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";
import { useUserAccountData } from "../../queries/userAccountData";
import {
  useUserReserveData,
  useProtocolReserveData,
  useUserReservesData,
} from "../../queries/protocolReserveData";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import {
  useUserAssetBalance,
  useUserReserveAssetBalancesDaiWei,
  useUserVariableDebtForAsset,
  useUserVariableDebtTokenBalances,
} from "../../queries/userAssets";
import { fontSizes, spacings, assetColor } from "../../utils/constants";
import { ModalIcon } from "../../utils/icons";
import { CollateralComposition } from "../../components/Chart/CollateralComposition";

type RepayDashProps = {
  token: ReserveTokenDefinition;
};

export const RepayDash: React.FC<RepayDashProps> = ({ token }) => {
  // General
  const { account: userAccountAddress } = useAppWeb3();
  const { data: reserves } = useAllReserveTokensWithData();
  const tokenAddresses = reserves?.map(token => {
    return token.tokenAddress;
  });

  // Debts
  const { data: debt } = useUserVariableDebtForAsset(token.tokenAddress);

  // User account data and balances
  const { data: userAccountData } = useUserAccountData(
    userAccountAddress ?? undefined
  );
  const { data: tokenBalance } = useUserAssetBalance(token.tokenAddress);

  // Debt position information
  const totalCollateral = userAccountData?.totalCollateralEth;
  const currentLtv = userAccountData?.currentLtv;
  const healthFactor = userAccountData?.healthFactor;

  const [isSmallerThan400, isSmallerThan900] = useMediaQuery([
    "(max-width: 400px)",
    "(max-width: 900px)",
  ]);

  return (
    <VStack spacing="0" w="100%" bg="primary.900" rounded="lg">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        fontSize={{ base: fontSizes.md, md: fontSizes.md }}
        w="100%"
        borderBottom="3px solid"
        borderBottomColor="primary.50"
        py={{ base: "2rem", md: "2.4rem" }}
        px={{ base: "1rem", md: "2.4rem" }}
      >
        <Flex
          w="30%"
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", lg: "center" }}
          justifyContent="flex-start"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} pr="1rem">
            You Borrowed
          </Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {bigNumberToString(debt)}
            </Text>
            {isSmallerThan400 ? null : " " + token.symbol}
          </Box>
        </Flex>
        <Flex
          w="30%"
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent="flex-start"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} pr="1rem">
            Wallet Balance
          </Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {bigNumberToString(tokenBalance)}
            </Text>
            {isSmallerThan400 ? null : " " + token.symbol}
          </Box>
        </Flex>
        <Flex
          w="30%"
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent="flex-start"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <HStack pr={{ base: "0rem", md: "1rem" }}>
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              Health factor
            </Text>
          </HStack>
          <ColoredText fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            {bigNumberToString(healthFactor)}
          </ColoredText>
        </Flex>
      </Flex>
      <Flex
        w="100%"
        py={{ base: "2rem", md: "2.4rem" }}
        px={{ base: "1rem", md: "2.4rem" }}
        justifyContent="space-between"
      >
        {isSmallerThan400 ? null : (
          <Stack
            justifyContent="flex-start"
            mr={{ base: "0.7rem", md: "1rem" }}
          >
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              {isSmallerThan900 ? "Collateral" : "Your collateral"}
            </Text>
            <HStack fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
              <Text
                fontSize={{
                  base: fontSizes.md,
                  md: fontSizes.lg,
                  lg: fontSizes.xl,
                }}
                fontWeight="bold"
              >
                $ {bigNumberToString(totalCollateral)}
              </Text>{" "}
              {token.symbol}
            </HStack>
          </Stack>
        )}

        <Stack
          justifyContent="flex-start"
          mr={{ base: "0.2rem", md: "1rem" }}
          whiteSpace="nowrap"
        >
          <HStack pr={{ base: "0rem", md: "1rem" }}>
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              {isSmallerThan900 ? "LTV" : "Current LTV"}
            </Text>
          </HStack>
          <HStack pr={{ base: "0rem", md: "1rem" }} align="center">
            <Text
              fontSize={{
                base: fontSizes.md,
                md: fontSizes.lg,
                lg: fontSizes.xl,
              }}
              fontWeight="bold"
            >
              {currentLtv
                ? (currentLtv.toUnsafeFloat() * 100).toLocaleString()
                : "-"}{" "}
              %
            </Text>
          </HStack>
        </Stack>
        <CollateralComposition />
      </Flex>
    </VStack>
  );
};
