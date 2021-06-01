import React from 'react';
import { 
  Box,
  Center,
  Circle,
  Spacer,
  StackDivider,
  Text,
  VStack
} from "@chakra-ui/react";

export const DepositActionHolder: React.FC = props => {
  return (
    <Center
      rounded="xl"
      minH="12.75rem"
      minW={{ base: "100%", md: "inherit" }}
      bg="primary.900"
      py="2.4rem"
      pl={27}
      pr={27}
      mt={35}
      color="white"
      d="flex"
      flexDirection="column"
    >
      <Box
        w="100%"
        h={30}
      >
        Back
      </Box>        
      <Text
        bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
        backgroundClip="text"
        fontWeight="bold"
      >
        Hoy much would you like to deposit?
      </Text>
      <Text
        maxW={438}
        justifyContent="center"
      >
        Please enter an amount you would like to deposit.
        The maximum amount you can deposit is shown below.
      </Text>
    </Center>
  );
}

export default DepositActionHolder;


/*
const DepositSubCard: React.FC = () => {
  return (
    <VStack
      w="50%"
      justifyContent="space-between"
      px={{ base: "1.1rem", md: "2.2rem" }}
      py={{ base: "1.3rem", md: "1.9rem" }}
      bg="secondary.900"
      rounded="2xl"
      position="relative"
      minH="14.4rem"
    >
      {isModalTrigger && (
        <Circle
          borderWidth={{ base: "1px", md: "2px" }}
          width={{ base: "1.2rem", md: "1.5rem" }}
          minHeight={{ base: "1.2rem", md: "1.5rem" }}
          boxSizing="content-box"
          as={Center}
          fontSize={{ base: ".85rem", md: "1rem" }}
          color="#FFC01B"
          borderColor="#FFC01B"
          position="absolute"
          top={{ base: "0.75rem", md: "1rem" }}
          right={{ base: "0.75rem", md: "1rem" }}
          cursor="pointer"
          onClick={onOpen}
        >
          ?
        </Circle>
      )}
      <Text
        color="white"
        fontSize={{ base: "1.2rem", md: "1.5rem" }}
        textAlign="center"
      >
        {title}
      </Text>
      <ColoredText>{value}</ColoredText>
      <Text color="white" fontSize="1.2rem">
        {subValue}
      </Text>
      {buttonOverrideContent === undefined ? (
        <Button
          color="white"
          fontSize={{ base: "1rem", md: "1.4rem" }}
          fontWeight="normal"
          bg="primary.300"
          py="1rem"
          my="1.2rem"
          width="100%"
          px={{ base: "5%", md: "2.171rem" }}
          disabled={disabled}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      ) : (
        <>{buttonOverrideContent}</>
      )}
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
            {modalChildren}
            <ModalFooter>
              <Button
                w={{ base: "100%", md: "60%" }}
                m="auto"
                py="1.5rem"
                fontSize={{ base: "1.6rem", md: "1.4rem" }}
                bg="secondary.100"
                color="white"
                fontWeight="normal"
                onClick={onClose}
              >
                Ok, I got it
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
};
*/
