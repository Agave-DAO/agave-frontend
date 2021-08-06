import React, { useState } from "react";
import UserInfoRow from "./UserInfoRow";
import { Text, Flex, Container, Box, Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";

import { useAppWeb3 } from "../../hooks/appWeb3";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";
import { useUserAccountData } from "../../queries/userAccountData";
import { useUserAssetBalance } from "../../queries/userAssets";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { useAssetPricesInDaiWei } from "../../queries/assetPriceInDai";
//Modals
import ModalComponent, { MODAL_TYPES } from "../../components/Modals";

// Helpers
import { round2Fixed } from "../../utils/helpers";
import {
  bigNumberToString,
  fixedNumberToPercentage,
} from "../../utils/fixedPoint";

const UserInfo: React.FC<{
  asset: ReserveTokenDefinition;
  history: any;
}> = ({ asset, history }) => {
  // ** Query data
  const userAccountAddress = useAppWeb3().account;
  const reserves = useAllReserveTokensWithData()?.data;
  const reserve = React.useMemo(
    () =>
      reserves?.find(reserve => reserve.tokenAddress === asset.tokenAddress) ??
      reserves?.find(
        reserve =>
          reserve.tokenAddress.toLowerCase() ===
          asset.tokenAddress.toLowerCase()
      ),
    [reserves, asset.tokenAddress]
  );
  const aTokenBalance = useUserAssetBalance(reserve?.aTokenAddress)?.data;
  const tokenBalance = useUserAssetBalance(asset.tokenAddress)?.data;
  const userAccountData = useUserAccountData(
    userAccountAddress ?? undefined
  )?.data;
  // const healthFactor = userAccountData?.healthFactor;

  // ** Check data for undefined and convert to usable front end data
  // TODO text size of asset will likly need to be controlled by helper function
  const symbol = asset.symbol ? asset.symbol : "Asset";
  const userBal = tokenBalance ? bigNumberToString(tokenBalance) : "0";
  const userAtokens = aTokenBalance ? bigNumberToString(aTokenBalance) : "0";

  const userBorrow = aTokenBalance ? bigNumberToString(aTokenBalance) : "0";
  const health = userAccountData?.healthFactor
    ? bigNumberToString(userAccountData.healthFactor)
    : "0";
  const loanVal = userAccountData?.maximumLtv
    ? fixedNumberToPercentage(userAccountData?.maximumLtv)
    : null;

  const availableBorrowsNative = userAccountData?.availableBorrowsEth;
  const price = useAssetPricesInDaiWei([asset.tokenAddress]).data;
  const availableBorrowsNativeAdjusted = availableBorrowsNative?.mul(1000);

  const balanceAsset =
    availableBorrowsNativeAdjusted && price
      ? availableBorrowsNativeAdjusted.div(price[0])
      : null;
  const borrowAmt = balanceAsset ? balanceAsset.toNumber() / 1000 : "0";

  const [modal_type, setModal] = useState(MODAL_TYPES.HEALTH_FACTOR);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const setModalOpen = React.useCallback(
    (selector: string) => {
      switch (selector) {
        case "Maximum LTV": {
          setModal(MODAL_TYPES.MAXIMUM_LTV);
          break;
        }
        case "Liquidity Threshold": {
          setModal(MODAL_TYPES.LIQUIDITY_THRESHOLD);
          //statements;
          break;
        }
        case "Liquidity Penalty": {
          setModal(MODAL_TYPES.LIQUIDITY_PENALTY);

          break;
        }
        default: {
          setModal(MODAL_TYPES.HEALTH_FACTOR);
          break;
        }
      }
      onOpen();
    },
    [onOpen]
  );
  // TODO Used for stable borrowing, ready when implmented
  // const [useAsCol] = false);

  return (
    <React.Fragment>
      <Container
        display="flex"
        flexDirection="column"
        textColor="white"
        maxWidth={{ base: "100%", lg: "450px" }}
        minWidth="25vw"
        p="0"
        m={{ base: "auto", md: "0" }}
        marginInlineEnd="0px"
        marginInlineStart="0px"
      >
        <Text fontSize="2xl" padding="1rem">
          Your information
        </Text>
        <Box
          position="relative"
          display="flex"
          flexDirection={{ base: "column", md: "row", lg: "column" }}
        >
          {/* Deposit Section Start */}
          <Box
            mr={{ base: "10px", lg: "0" }}
            w="100%"
            p="15px"
            mb="15px"
            position="relative"
            borderRadius="15px"
            background="primary.900"
            boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 3px 0px"
          >
            <Box
              display="flex"
              fontSize="2xl"
              mb="15px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text fontSize="2xl" fontWeight="bold">
                Deposits
              </Text>
              <Flex>
                <Button
                  size="lg"
                  colorScheme="whiteAlpha"
                  onClick={() => history.push(`/deposit/${symbol}`)}
                >
                  Deposit
                </Button>
                {/*
                <Button
                  size="lg"
                  colorScheme="Green"
                  onClick={() => history.push(`/withdraw/${symbol}`)}
                >
                  Withdraw
                </Button>
                */}
              </Flex>
            </Box>
            <Box>
              <UserInfoRow
                title="Your wallet balance"
                value={userBal}
                type={symbol}
              />
              <UserInfoRow
                title="You already deposited"
                value={userAtokens}
                type={symbol}
              />
              {/* TODO Used for Stable coin borrowing, when ready to be implemented */}
              {/* <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
                mb="15px"
              >
               
                <Flex>
                  <Text fontSize="2xl">Use as collateral</Text>
                </Flex>
                
                <Flex>
                  <Text fontSize="2xl">
                    {useAsCol ? "Yes" : "No"}
                    <Switch
                      pl="5px"
                      classsymbol="switch"
                      isChecked={useAsCol}
                      aria-label={"yes"}
                      colorScheme="yellow"
                      onChange={() => {
                        history.push(`/collateral/${symbol}`);
                      }}
                    />
                  </Text>
                </Flex>
              </Flex> */}
            </Box>
          </Box>
          {/* BORROW SECTION START */}
          <Box
            w="100%"
            p="15px"
            mb="15px"
            position="relative"
            borderRadius="15px"
            background="primary.900"
            boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 3px 0px"
          >
            <Box
              display="flex"
              fontSize="2xl"
              mb="15px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text fontSize="2xl" fontWeight="bold">
                Borrows
              </Text>
              <Flex>
                <Button
                  size="lg"
                  colorScheme="whiteAlpha"
                  onClick={() => history.push(`/borrow/${symbol}`)}
                >
                  Borrow
                </Button>
              </Flex>
            </Box>
            <Box>
              <UserInfoRow title="Borrowed" value={userBorrow} type={symbol} />
              <UserInfoRow
                title="Health Factor"
                value={health}
                enableModal={true}
                modalOpen={setModalOpen}
              />
              <UserInfoRow title="Loan To Value" value={loanVal} type="%" />
              <UserInfoRow
                title="You can Borrow"
                value={borrowAmt}
                type={symbol}
              />
            </Box>
          </Box>
        </Box>
      </Container>
      <ModalComponent isOpen={isOpen} mtype={modal_type} onClose={onClose} />
    </React.Fragment>
  );
};

export default UserInfo;
