import React, { useState } from "react";
import { Text, Flex, Box, useMediaQuery } from "@chakra-ui/react";

// TODO real types
interface Props {
  title: string;
  value: any;
}

const MiddleCard: React.FC<Props> = ({ ...props }) => {
  // Default Component States
  const [title] = useState(props.title ? props.title : "Stats");
  const [value] = useState(props.value ? props.value : "~");

  // const [isLargeTab] = useMediaQuery("(max-width: 1200px)");
  // const [isSmallTab] = useMediaQuery("(max-width: 800px)");
  const [isLargePhone] = useMediaQuery("(max-width: 600px)");
  const [isMobile] = useMediaQuery("(max-width: 450px)");

  return (
    <React.Fragment>
      <Flex
        p="5px"
        w={isMobile ? "80vw" : isLargePhone ? "75vw" : ""}
        m="2"
        minW="150px"
        alignItems="center"
        justifyContent="space-between"
        borderWidth="thin"
        borderColor="white"
        borderRadius="10"
      >
        <Box>
          <Text fontSize="lg" color="white">
            {title} |
          </Text>
        </Box>
        <Box>
          <Text fontSize="lg" color="white">
            {value}
          </Text>
        </Box>
      </Flex>
    </React.Fragment>
  );
};

export default MiddleCard;
