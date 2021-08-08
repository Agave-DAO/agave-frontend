import React from "react";
import { Text, Flex, Box } from "@chakra-ui/react";

interface Props {
  title: string;
  value: string | number | undefined;
}

const MiddleCard: React.FC<Props> = ({ ...props }) => {
  // Default Component States
  const title = props.title ? props.title : "Stats";
  const value = props.value ? props.value : "~";

  // const [isLargeTab] = useMediaQuery("(max-width: 1200px)");
  // const [isSmallTab] = useMediaQuery("(max-width: 800px)");
  // const [isLargePhone] = useMediaQuery("(max-width: 600px)");
  // const [isMobile] = useMediaQuery("(max-width: 450px)");

  return (
    <React.Fragment>
      <Flex
        p="5px"
        w="90%"
        m="2"
        minW="150px"
        alignItems="center"
        justifyContent="space-between"
        borderWidth="thin"
        borderColor="white"
        borderRadius="5px"
      >
        <Box>
          <Text fontSize="xl" color="white">
            {title} |
          </Text>
        </Box>
        <Box>
          <Text fontWeight="bold" fontSize="xl" color="white">
            {value}
          </Text>
        </Box>
      </Flex>
    </React.Fragment>
  );
};

export default MiddleCard;
