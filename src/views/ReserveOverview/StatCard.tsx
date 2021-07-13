import React from "react";
import { Text, Box } from "@chakra-ui/react";

interface Props {
  title: string;
  color?: string;
  value: any;
  type?: string;
}

const StatCard: React.FC<Props> = ({ ...props }) => {
  return (
    <React.Fragment>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="flex-start"
          position="relative"
        >
          <Text fontSize="lg">{props.title}</Text>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Text
            fontSize="lg"
            fontWeight="extrabold"
            color={`${props.color}.100`}
          >
            {props.value}
            {props.type}
          </Text>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default StatCard;
