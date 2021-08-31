import React from "react";
import { Text, Box, Center } from "@chakra-ui/react";

interface Props {
  title: string;
  color: string;
  apy: any;
  avg?: any;
  total?: any;
}

const APYCard: React.FC<Props> = ({ ...props }) => {
  // Default Component States
  const title = props.title ? props.title : "Stats";
  const color = props.color ? props.color : "green";
  const apy = props.apy ? `${props.apy} %` : "—";

  // Media Queries to get the right fit
  // const [isSmallTab] = useMediaQuery("(max-width: 800px)");
  // const [isLargePhone] = useMediaQuery("(max-width: 600px)");
  // const [isMobile] = useMediaQuery("(max-width: 450px)");

  return (
    <React.Fragment>
      <Box
        minW="180px"
        maxW={{ base: "100%", md: "20vw" }}
        w={{ base: "100%", md: "25rem" }}
        m={{ base: "10px 5px" }}
        borderRadius="10px"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="white"
      >
        <Box
          m="-1px"
          p="5px"
          backgroundColor={`${color}.300`}
          borderWidth="1px"
          borderRadius="10px 10px 0px 0px"
        >
          <Center>
            <Text fontSize="xl" fontWeight="semibold">
              {title}
            </Text>
          </Center>
        </Box>
        <Box pl="4px" pr="4px">
          <Box
            fontSize="lg"
            marginBottom="2px"
            display="flex"
            flexFlow="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box
              p="4px"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <Text fontSize="lg">APY</Text>
            </Box>
            <Box
              p="4px"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              flex="1 1 0%"
            >
              <Text fontSize="xl" fontWeight="extrabold">
                {apy}
              </Text>
            </Box>
          </Box>
          {/*
                      UNTIL THERE IS NO SUBGRAPH WITH LOTS OF DATA NOT WORTH DISPLAYING THESE STATS

          <Box
            fontSize="lg"
            marginBottom="8px"
            display="flex"
            flexFlow="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box
              p="4px"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <Text fontSize="lg">30D Avg.</Text>
            </Box>
            <Box
              p="4px"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              flex="1 1 0%"
            >
              <Text fontSize="lg" fontWeight="extrabold">
                {avg}
              </Text>
            </Box>
                     
          </Box>
          <Box
            fontSize="lg"
            marginBottom="8px"
            display="flex"
            flexFlow="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box
              p="4px"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <Text fontSize="lg">% Over Total</Text>
            </Box>
            <Box
              p="4px"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              flex="1 1 0%"
            >
              <Text fontSize="lg" fontWeight="extrabold">
                {total}
              </Text>
            </Box>
          </Box>
           */}
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default APYCard;
