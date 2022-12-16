import React from "react";
import { 
    Box, 
    Center, 
    Text, 
    Flex, 
    VStack, 
    StackDivider, 
    Spinner, 
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input
} from "@chakra-ui/react";
import { CenterProps, HStack } from "@chakra-ui/layout";
import { isMobileOnly, isMobile } from "react-device-detect";
import { useDisclosure } from "@chakra-ui/hooks";
import ColoredText from "../../components/ColoredText";
import { ModalIcon } from "../../utils/icons";
import { fontSizes, spacings } from "../../utils/constants";

export const WrapBanner: React.FC<{}> = () => {
    return (
        <Box w="100%">
        {!isMobileOnly && (
          <Center width="100%" justifyContent="space-between">
            <Text
              fontWeight="bold"
              color="white"
              fontSize={{ base: "1.8rem", md: "2.4rem" }}
            >
              Wrap tokens
            </Text>
          </Center>
        )}
      </Box>
    );
}

export const WrapLayout: React.FC<{}> = () => {
    return (
      <Flex flexDirection="column">
        <Flex
          align="center"
          flexBasis="auto"
          spacing="1em"
          w="100%"
          flexDirection={{ base: "column", lg: "row" }}
          m="auto"
          color="white"
        >
          <OuterBox
            outerType="wrap"
            mr={{ base: "inherit", lg: "1%" }}
          >
          </OuterBox>

          <OuterBox
            outerType="unwrap"
            ml={{ base: "inherit", lg: "1%" }}
          >
          </OuterBox>

        </Flex>
      </Flex>

    );
}



const OuterBox: React.FC<{ 
    outerType: string; // wrap, unwrap
} & CenterProps> = ({
    outerType,
    children,
    ...props
  }) => {
    return (
      <Center
        boxSizing="content-box"
        flexDirection="column"
        rounded="xl"
        textAlign="center"
        minH="10.6rem"
        mb="5"
        minW={{ base: "100%", lg: "auto" }}
        flex={1}
        bg="primary.900"
        py="1rem"
        {...props}
      >
        <VStack
          spacing={4}
          w="90%"
          align="center"
          flexDirection="column"
        >
          <Text>
            {outerType=="wrap"?"Wrap tokens":"Unwrap tokens"}
          </Text>
          <InnerBox
            tokenAmount=""
            balance="0"
            outerType={outerType}
            innerType="from"
            isModalTrigger={true}
            onClick={() =>{}}
          />
          <InnerBox
            tokenAmount=""
            balance="0"
            outerType={outerType}
            innerType="to"
            isModalTrigger={false}
            onClick={() =>{}}
          />
          <Button
            width="30%"
            mt="2.4rem"
            textTransform="uppercase"
            background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
            color="secondary.900"
            fontWeight="bold"
            px={{ base: "10rem", md: "6rem" }}
            py="1.5rem"
            fontSize={fontSizes.md}
           >
            {outerType=="wrap"?"Wrap":"Unwrap"}
          </Button>
        </VStack>
      </Center>
    );
  };

  const InnerBox: React.FC<{
    tokenAmount: string;
    balance: string;
    innerType: string; // from, to
    outerType: string; // wrap, unwrap
    isModalTrigger?: boolean;
    onClick: React.MouseEventHandler;
    buttonOverrideContent?: React.ReactNode | undefined;
  }> = ({
    tokenAmount,
    balance,
    innerType,
    outerType,
    onClick,
    isModalTrigger,
    buttonOverrideContent,
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <Box
        w="100%"
        maxW="100%"
        px={{ base: "1.1rem", md: "2.2rem" }}
        py={{ base: spacings.md, md: "1.5rem" }}
        bg="secondary.900"
        rounded="2xl"
        position="relative"
        minW="40%"
        mx={{ base: "0.5rem", md: "1rem" }}
        my="1rem"
        align="center"
      >
        <HStack spacing="1rem" mr="1rem" height="100%">
            <VStack
                spacing={4}
                w="90%"
                align="stretch"
                textAlign="left"
                flexDirection="column"
            >
                <Input
                    type="text"
                    fontSize="40"
                    maxWidth="100px"
                    height="50px"
                    rounded="0s"
                    border="0"
                    borderBottom="1px solid var(--chakra-colors-primary-900)"
                    placeHolder="0"
                    value={tokenAmount}
                />

                {innerType=="from"?
                    <Button
                        color="white"
                        fontSize={{ base: "1rem", md: fontSizes.sm }}
                        fontWeight="normal"
                        bg="primary.300"
                        alignSelf="flex-start"
                        disabled={true}
                    >
                        MAX
                    </Button>
                :""}
            </VStack>
            <VStack
                spacing={4}
                w="90%"
                align="stretch"
                textAlign="right"
                flexDirection="column"
            >
                {buttonOverrideContent === undefined ? (
                    <Button
                        color="white"
                        fontSize={{ base: "1rem", md: fontSizes.md }}
                        fontWeight="normal"
                        bg="primary.300"
                        py="1rem"
                        my="1.2rem"
                        padding="5px"
                        alignSelf="flex-end"
                        px={{ base: "5%", md: "2.171rem" }}
                        disabled={innerType=="to"}
                        onClick={onOpen}
                    >
                        {innerType=="from"?"Select token":(outerType=="wrap"?"Wrapped token":"Unwrapped token")}
                    </Button>
                ) : (
                 <>{buttonOverrideContent}</>
                )}
                
            </VStack>
        </HStack>
        {isModalTrigger && (
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                color="primary.900"
                bg="linear-gradient(180deg, #F3FFF7 8.89%, #DCFFF1 146.53%)"
                px={{ base: "1.5rem", md: "2.9rem" }}
                py="3.5rem"
                rounded="lg"
                minW={{ base: "80%", md: "30vw" }}
                minH={{ base: "50%", md: "30vh" }}
            >
                List of tokens here
                <ModalFooter>
                <Button
                    w={{ base: "100%", md: "60%" }}
                    m="auto"
                    py="1.5rem"
                    fontSize={{ base: "1.6rem", md: fontSizes.md }}
                    bg="secondary.100"
                    color="white"
                    fontWeight="normal"
                    onClick={onClose}
                >
                    Close
                </Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        )}
      </Box>
    );
  };
  