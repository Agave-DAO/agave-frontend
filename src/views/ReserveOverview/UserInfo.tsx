import React, { useState } from "react";
import UserInfoRow from "./UserInfoRow";
import { Text, Flex, Container, Box, Button } from "@chakra-ui/react";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";

// Componete Styles

const UserInfo: React.FC<{
  asset: ReserveTokenDefinition;
  history: any;
}> = ({ asset, history }) => {
  // Default Componate States
  const [name] = useState(asset.symbol ? asset.symbol : "Asset");
  const [userSupply] = useState("0");
  const [userBal] = useState("0");
  const [userBorrow] = useState("0");
  const [health] = useState("0");
  const [loanVal] = useState("0");
  const [borrowAmt] = useState("0");
  // TODO Used for stable borrowing, ready when implmented
  // const [useAsCol] = useState(false);

  return (
    <React.Fragment>
      <Container
        display="flex"
        flexDirection="column"
        textColor="white"
        maxW="1200px"
      >
        <Text fontSize="xl" padding="1rem">
          Your information
        </Text>
        <Box
          maxW="100%"
          minW="30rem"
          position="relative"
          display="flex"
          flexDirection={{ base: "column", lg: "row", xl: "column" }}
        >
          {/* Deposit Section Start */}
          <Box
            mr="10px"
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
                  onClick={() => history.push(`/deposit/${name}`)}
                >
                  Deposit
                </Button>
                <Button
                  size="lg"
                  colorScheme="Green"
                  onClick={() => history.push(`/withdraw/${name}`)}
                >
                  Withdraw
                </Button>
              </Flex>
            </Box>
            <Box>
              <UserInfoRow
                title="Your wallet balance"
                value={userBal}
                type={name}
              />
              <UserInfoRow
                title="You already deposited"
                value={userSupply}
                type={name}
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
                      className="switch"
                      isChecked={useAsCol}
                      aria-label={"yes"}
                      colorScheme="yellow"
                      onChange={() => {
                        history.push(`/collateral/${name}`);
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
                  onClick={() => history.push(`/borrow/${name}`)}
                >
                  Borrow
                </Button>
              </Flex>
            </Box>
            <Box>
              <UserInfoRow title="Borrowed" value={userBorrow} type={name} />
              <UserInfoRow title="Health Factor" value={health} />
              <UserInfoRow title="Loan To Value" value={loanVal} type="%" />
              <UserInfoRow
                title="Available To You"
                value={borrowAmt}
                type={name}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default UserInfo;
