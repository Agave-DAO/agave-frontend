import { Box, Button, Center, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import ColoredText from "../../components/ColoredText";
import { fontSizes } from "../../utils/constants";
import { getUserProxyAddress } from "../../queries/userProxy";

export interface UserProxyLayoutProps  {
  userProxyResult: () => any;
}

export function createProxyAddress() {
  console.log('function called');
}

export const SwapperBanner: React.FC<{}> = props => {
    return (
        <>
            <Center width="100%" justifyContent="space-between">
                <Text
                    fontWeight="bold"
                    color="white"
                    fontSize={{ base: "1.8rem", md: "2.4rem" }}
                >
                    Swap
                </Text>
                <Text
                    fontWeight="normal"
                    color="white"
                >
                    
                </Text>
            </Center>
        </>
    );
}

export const CreateProxyLayout: React.FC<UserProxyLayoutProps> = props => {

  return (
        <Center
        w={ "100%"}
        boxSizing="content-box"
        flexDirection="column"
        rounded="xl"
        float="left"
        minH="25.6rem"
        bg="primary.900"
        px={{ base: "0rem", md: "0rem" }}
        py="2.4rem"
        {...props}
      >
        <ColoredText
          fontSize={{ base: "1.6rem", md: "1.8rem" }}
          textAlign="center"
        >
          No proxy contract
        </ColoredText>
        <Text
          color="white"
          textAlign="center"
          margin="2.8rem"
          fontSize={{ base: fontSizes.md, md: "inherit" }}
        >
          You need to create a proxy contract in order to place orders
        </Text>

        <Box>
          <Button
            bg={useColorModeValue({ base: "primary.500", md: "primary.500" }, "primary.500")}
            colorScheme="teal"
            size="xl"
            h="40px"
            margin="10px"
            padding="20px"
            onClick={createProxyAddress}
          >
            Create proxy contract
          </Button>

        </Box>
      </Center>
    )
}



export const ProxyLayout: React.FC<UserProxyLayoutProps> = ({
  userProxyResult
}:any) => {
  const proxyAddress = getUserProxyAddress()['data'];
  console.log('userProxyResult',userProxyResult);
  return (
      <>
          ProxyAddress: {proxyAddress}
      </>
  );
}

