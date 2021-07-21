import React from "react";
import ColoredText from "../../components/ColoredText";
import { Flex } from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";
import { withRouter } from "react-router-dom";

const ReserveBanner: React.FC<{}> = (props: any) => {
  const message = props.location.pathname;
  const title = "Reserve Details";

  return (
    <Flex
      flexDir="column"
      justifyItems="stretch"
      height="auto"
      marginRight="auto"
    >
      <ColoredText fontSize="5xl" textTransform="capitalize">
        {props.match.params.assetName ?? "-"} {title}
      </ColoredText>

      <Text align="left" fontSize="3xl">
        {`${message}`}
      </Text>
    </Flex>
  );
};

export default withRouter(ReserveBanner);
