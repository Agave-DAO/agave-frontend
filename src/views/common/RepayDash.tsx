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
import { formatEther } from "ethers/lib/utils";
import React from "react";
import ColoredText from "../../components/ColoredText";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";
import { useUserAccountData } from "../../queries/userAccountData";
import {
  useUserAssetBalance,
  useUserReserveAssetBalancesDaiWei,
  useUserVariableDebtTokenBalances,
} from "../../queries/userAssets";
import { fontSizes, spacings, assetColor } from "../../utils/constants";
import { ModalIcon } from "../../utils/icons";

type RepayDashProps = {
  token: ReserveTokenDefinition;
};

export const RepayDash: React.FC<RepayDashProps> = ({ token }) => {
  // General
  const { account: userAccountAddress } = useAppWeb3();

  // Debts
  const { data: debts } = useUserVariableDebtTokenBalances();
  const reserveWithDebt = React.useMemo(
    () =>
      debts?.find(reserve => reserve.tokenAddress === token.tokenAddress) ??
      debts?.find(
        reserve =>
          reserve.tokenAddress.toLowerCase() ===
          token.tokenAddress.toLowerCase()
      ),
    [debts, token.tokenAddress]
  );

  // User account data and balances
  const { data: userAccountData } = useUserAccountData(
    userAccountAddress ?? undefined
  );
  const { data: tokenBalance } = useUserAssetBalance(token.tokenAddress);

  // Debt position information
  const totalCollateral = userAccountData?.totalCollateralEth;
  const currentLtv = userAccountData?.currentLtv;
  const healthFactor = userAccountData?.healthFactor;

  // Collateral composition
  const { data: allReservesData } = useUserReserveAssetBalancesDaiWei();
  const totalCollateralValue = React.useMemo(() => {
    return allReservesData?.reduce(
      (memo: BigNumber, next) =>
        next.daiWeiPriceTotal !== null ? memo.add(next.daiWeiPriceTotal) : memo,
      constants.Zero
    );
  }, [allReservesData]);
  const collateralComposition = React.useMemo(() => {
    const compositionArray = allReservesData?.map(next => {
      if (
        next.daiWeiPriceTotal != undefined &&
        next.decimals != undefined &&
        totalCollateralValue != undefined
      ) {
        const decimalPower = BigNumber.from(10).pow(next.decimals);
        return next.daiWeiPriceTotal
          .mul(decimalPower)
          .div(totalCollateralValue);
      } else {
        return BigNumber.from(0);
      }
    });

    return compositionArray
      ? compositionArray.map(share => {
          if (share.gt(0)) {
            return formatEther(share.mul(100));
          }
        })
      : [];
  }, [allReservesData, totalCollateralValue]);
  const collateralData = collateralComposition.map(x => {
    if (x != null) {
      return x.substr(0, x.indexOf(".") + 3);
    }
  });

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
              {reserveWithDebt ? formatEther(reserveWithDebt.balance) : 0}
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
              {tokenBalance ? formatEther(tokenBalance).slice(0, 8) : 0}
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
            <ModalIcon
              position="relative"
              top="0"
              right="0"
              onOpen={() => {}}
            />
          </HStack>
          <ColoredText fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            {healthFactor?.toUnsafeFloat().toLocaleString() ?? "-"}
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
                {totalCollateral ? formatEther(totalCollateral) : "-"} XDAI
              </Text>{" "}
              {token.symbol}
            </HStack>
          </Stack>
        )}
        <VStack justifyContent="flex-start" mr={{ base: "0.7rem", md: "1rem" }}>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
            {isSmallerThan900 ? "Composition" : "Collateral composition"}
          </Text>
          <Popover trigger="hover">
            <PopoverTrigger>
              <Grid
                role="button"
                w="100%"
                templateColumns={
                  collateralData.filter(x => x != null).join("% ") + "%"
                }
                h="2rem"
                borderRadius="8px"
                borderColor="#444"
                borderStyle="solid"
                borderWidth="3px"
                overflow="hidden"
              >
                {allReservesData?.map((token, index) => (
                  <Box
                    bg={assetColor[token.symbol]}
                    w="100%"
                    h="100%"
                    borderRadius="0"
                    _hover={{ bg: assetColor[token.symbol], boxShadow: "xl" }}
                    _active={{ bg: assetColor[token.symbol] }}
                    _focus={{ boxShadow: "xl" }}
                    d={collateralComposition[index] != null ? "block" : "none"}
                  />
                ))}
              </Grid>
            </PopoverTrigger>
            <PopoverContent bg="primary.300" border="2px solid">
              <PopoverBody bg="gray.700">
                <VStack m="auto" py="2rem" w="90%">
                  {allReservesData?.map((token, index) =>
                    collateralComposition[index] != null ? (
                      <Flex
                        id={index + token.symbol}
                        alignItems="center"
                        justifyContent="space-between"
                        w="100%"
                      >
                        <Box
                          bg={assetColor[token.symbol]}
                          boxSize="1em"
                          minW="1em"
                          minH="1em"
                          borderRadius="1em"
                        />
                        <Text ml="1em" width="50%">
                          {" "}
                          {token.symbol}
                        </Text>
                        <Text ml="1em"> {collateralData[index] + "%"}</Text>
                      </Flex>
                    ) : (
                      <Text></Text>
                    )
                  )}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </VStack>
        <Stack
          justifyContent="flex-start"
          mr={{ base: "0.2rem", md: "1rem" }}
          whiteSpace="nowrap"
        >
          <HStack pr={{ base: "0rem", md: "1rem" }}>
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              {isSmallerThan900 ? "LTV" : "Loan to value"}
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
            <ModalIcon
              position="relative"
              top="0"
              right="0"
              onOpen={() => {}}
            />
          </HStack>
        </Stack>
      </Flex>
    </VStack>
  );
};
