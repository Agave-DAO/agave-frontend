import React from "react";
import { Text, Box, Center, useMediaQuery } from "@chakra-ui/react";

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
  const avg = props.avg ? props.avg : "—";
  const total = props.total ? `${props.total} %` : "—";

  // Media Queries to get the right fit
  const [isSmallTab] = useMediaQuery("(max-width: 800px)");
  const [isLargePhone] = useMediaQuery("(max-width: 600px)");
  const [isMobile] = useMediaQuery("(max-width: 450px)");

  return (
    <React.Fragment>
      <Box
        minW={{ base: "200px" }}
        w={isLargePhone ? "80vw" : isSmallTab ? "150px" : "200px"}
        m={isMobile ? "8" : isSmallTab ? "2" : "10px 15px"}
        borderRadius="15px"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="white"
      >
        <Box
          m="-1px"
          p="5px"
          backgroundColor={`${color}.100`}
          borderWidth="1px"
          borderRadius="14px 14px 0px 0px"
        >
          <Center>
            <Text fontSize="lg">{title}</Text>
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
              <Text fontSize="lg" fontWeight="extrabold">
                {apy}
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
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default APYCard;
