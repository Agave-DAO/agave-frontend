import React from "react";
import { BigNumber, constants, FixedNumber, BigNumberish } from "ethers";
import {
  HStack,
  Popover,
  Grid,
  Box,
  Text,
  VStack,
  Flex,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  UserReserveData,
  useUserReserveData,
  useUserReservesData,
} from "../../queries/protocolReserveData";
import { borrowListener } from "../../utils/contracts/events/events";
import { fontSizes, spacings, assetColor } from "../../utils/constants";
import { useUserReserveAssetBalancesDaiWei } from "../../queries/userAssets";
import {
  bigNumberToString,
  fixedNumberToPercentage,
} from "../../utils/fixedPoint";

export const CollateralComposition: React.FC = () => {
  const { data: allUserReservesBalances } = useUserReserveAssetBalancesDaiWei();

  const tokenAddresses = allUserReservesBalances?.map(token => {
    return token.tokenAddress;
  });

  const { data: allUserReservesData } = useUserReservesData(tokenAddresses);

  const totalCollateralValue = React.useMemo(() => {
    return allUserReservesBalances?.reduce(
      (memo: BigNumber, next) =>
        next.daiWeiPriceTotal !== null ? memo.add(next.daiWeiPriceTotal) : memo,
      constants.Zero
    );
  }, [allUserReservesBalances]);

  const collateralComposition = React.useMemo(() => {
    const compositionArray = allUserReservesBalances?.map((next, index) => {
      const withCollateralEnabled =
        allUserReservesData?.[next.tokenAddress]?.usageAsCollateralEnabled;
      if (
        next.daiWeiPriceTotal !== null &&
        next.decimals &&
        totalCollateralValue &&
        !totalCollateralValue.eq(BigNumber.from(0)) &&
        withCollateralEnabled
      ) {
        const decimalPower = BigNumber.from(10).pow(next.decimals);
        return next.daiWeiPriceTotal
          .mul(decimalPower)
          .div(totalCollateralValue);
      } else return BigNumber.from(0);
    });
    return compositionArray
      ? compositionArray.map(share => {
          if (share.gt(0)) {
            return bigNumberToString(share.mul(100));
          } else return null;
        })
      : [];
  }, [allUserReservesBalances, totalCollateralValue]);

  const collateralData = collateralComposition.map((x, index) => {
    if (x != null) return x.substr(0, x.indexOf(".") + 3);
  });

  const [isSmallerThan400, isSmallerThan900] = useMediaQuery([
    "(max-width: 400px)",
    "(max-width: 900px)",
  ]);

  return (
    <Flex
      h="100%"
      spacing={spacings.md}
      mr={{ base: "0rem", md: "1rem" }}
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent="flex-start"
      flexDirection="column"
    >
      <HStack px={{ base: "0rem", md: "1rem" }} mb="0.5em">
        <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
          {isSmallerThan900 ? "Collateral" : "Collateral Composition"}
        </Text>
      </HStack>
      <Popover trigger="hover">
        <PopoverTrigger>
          <Grid
            role="button"
            w="100%"
            templateColumns={
              collateralData.filter(x => x !== undefined).join("% ") + "%"
            }
            h="2rem"
            borderRadius="8px"
            borderColor="#444"
            borderStyle="solid"
            borderWidth="3px"
            overflow="hidden"
          >
            {allUserReservesBalances?.map((token, index) => (
              <Box
                bg={assetColor[token.symbol]}
                w="100%"
                h="100%"
                borderRadius="0"
                _hover={{ bg: assetColor[token.symbol], boxShadow: "xl" }}
                _active={{ bg: assetColor[token.symbol] }}
                _focus={{ boxShadow: "xl" }}
                d={collateralComposition[index] !== null ? "block" : "none"}
              />
            ))}
          </Grid>
        </PopoverTrigger>
        <PopoverContent bg="primary.300" border="2px solid">
          <PopoverBody bg="gray.700">
            <VStack m="auto" py="2rem" w="90%">
              {allUserReservesBalances?.map((token, index) =>
                collateralComposition[index] !== null ? (
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
    </Flex>
  );
};

export default CollateralComposition;
