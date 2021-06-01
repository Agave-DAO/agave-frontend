import { Center } from "@chakra-ui/layout";

export const ErrorWrapper: React.FC = ({ children }) => {
  return (
    <Center
      minW={["31vw"]}
      maxW="53.6rem"
      minH="40vh"
      maxH="33.6rem"
      m="auto"
      px="7.2rem"
      bg="primary.500"
      flexDirection="column"
      rounded="lg"
    >
      {children}
    </Center>
  );
};
