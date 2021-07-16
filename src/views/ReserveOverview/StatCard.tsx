import React from "react";
import { Text, Box } from "@chakra-ui/react";
import { ModalIcon } from "../../utils/icons";

interface Props {
  title: string;
  color?: string;
  value: any;
  type?: string;
  enableModal?: boolean;
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
          {props.enableModal && (
            <ModalIcon
              position="relative"
              top="0"
              left={{ base: "0.5", md: "2" }}
              onOpen={() => {}}
            />
          )}
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
