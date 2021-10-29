import React from "react";
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
  PopoverBody,
  useMediaQuery,
} from "@chakra-ui/react";
import { fontSizes, spacings, assetColor } from "../../utils/constants";
import { useUserDepositAssetBalancesDaiWei } from "../../queries/userAssets";
import { useCollateralComposition } from "../../hooks/collateralComposition";
import { bigNumberToString } from "../../utils/fixedPoint";
import { useNativeSymbols } from "../../utils/icons";

export const CollateralComposition: React.FC = () => {
  const { data: allUserATokenBalances } = useUserDepositAssetBalancesDaiWei();
  const nativeSymbols = useNativeSymbols();
  const reserves = allUserATokenBalances?.map(asset => {
    return asset.symbol === nativeSymbols.wrappednative
      ? {
          ...asset,
          symbol: nativeSymbols?.native,
        }
      : asset;
  });

  const collateralComposition = useCollateralComposition();
  const collateralData = collateralComposition.map(x => {
    if (x !== null) {
      return bigNumberToString(x, 3);
    }
    return null;
  });
  const displayCollateralComposition = collateralData.length > 0 ? true : false;

  const isSmallerThan900 = useMediaQuery("(max-width: 900px)");

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
      {displayCollateralComposition ? (
        <Popover trigger="hover">
          <PopoverTrigger>
            <Grid
              role="button"
              w="100%"
              templateColumns={
                collateralData.filter(x => x != undefined).join("% ") + "%"
              }
              h="2rem"
              borderRadius="8px"
              borderColor="#444"
              borderStyle="solid"
              borderWidth="3px"
              overflow="hidden"
            >
              {reserves?.map((token, index) => (
                <Box
                  key={"comp_" + index}
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
                {reserves?.map((token, index) =>
                  collateralComposition[index] !== null ? (
                    <Flex
                      key={"flex-collateralComposition_" + index}
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
                  ) : null
                )}
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : (
        "-"
      )}
    </Flex>
  );
};

export default CollateralComposition;
