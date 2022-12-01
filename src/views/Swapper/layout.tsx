import { Box, Button, Center, Flex, Stack, Text, Image, useColorModeValue, VStack, StackDivider } from "@chakra-ui/react";
import ColoredText from "../../components/ColoredText";
import { fontSizes } from "../../utils/constants";
import { getUserProxyAddress } from "../../queries/userProxy";
import loadingImg from "../../assets/image/loading.svg";
import errorImg from "../../assets/image/error.svg";

export interface UserProxyLayoutProps  {
  mutationCall: () => any;
}

export interface StakingBannerProps {}

export const SwapperBanner: React.FC<StakingBannerProps> = props => {
    return (

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
            onClick={props.mutationCall}
          >
            Create proxy contract
          </Button>

        </Box>
      </Center>
    )
}

export const WaitingLayout: React.FC<{}> = props => {

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

          <Image src={loadingImg} boxSize="2.5rem" />

          <Text
            color="white"
            textAlign="center"
            margin="2.8rem"
            fontSize={{ base: fontSizes.md, md: "inherit" }}
          >
            Checking for proxy address...
          </Text>

      </Center>
    )
}

export const ErrorLayout: React.FC<{}> = props => {

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

          <Image src={errorImg} boxSize="2.5rem" />

          <Text
            color="white"
            textAlign="center"
            margin="2.8rem"
            fontSize={{ base: fontSizes.md, md: "inherit" }}
          >
            An error occurred!
          </Text>

      </Center>
    )
}



export const ProxyLayout: React.FC<{}> = ({userProxyResult, props}:any) => {
  const proxyAddress = getUserProxyAddress()['data'];
  return (
    <Flex
      flexDirection={{ base: "column", md: "row" }}
      px={{ base: "0.5rem", md: "0" }}
      my={10}
      height="100%"
      alignItems="flex-start">

      <Box w={{ base: "100%", md: "auto" }}>

        <Box
          w="auto"
          minW={{ md: 300 }}
          mr={{ base: 0, md: 10 }}
          marginTop={0}
          boxSizing="content-box"
          rounded="xl"
          bg="primary.900"
          py="2rem"
          color="white">

          <Center>

            <Text 
              margin="10px">
                Total orders: 0
            </Text>

          </Center>

          <Center>

            <Button
              bg={useColorModeValue({ base: "primary.500", md: "primary.500" }, "primary.500")}
              colorScheme="teal"
              size="xl"
              h="40px"
              margin="10px"
              padding="20px">
              Place new order
            </Button>

          </Center>

        </Box>

      </Box>

      <Box
        boxSizing="content-box"
        rounded="xl"
        minH="12.75rem"
        w="100%"
        bg="primary.900"
        py="2rem"
        mb={{ base: "1rem", md: "0" }}
        color="white">
          <ColoredText
            fontSize={{ base: "1.6rem", md: "1.8rem" }}
            textAlign="center">
            Active orders
          </ColoredText>
          <Box w="100%" pl={27} pr={27} pt={5}>
            <Box overflowY="auto">
              <Text
                textAlign="center">
                No orders
              </Text>
            </Box>
          </Box>

      </Box>

    </Flex>
  )
}

