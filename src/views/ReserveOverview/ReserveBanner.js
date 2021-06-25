import React, { useState, useEffect } from "react";
import ColoredText from "../../components/ColoredText";
import { Flex } from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

const BorrowTitle = styled.div`
  .borrowTitle {
    text-transform: capitalize;
  }
`;

function ReserveBanner(props) {
  const message = props.location.pathname;
  const title = "Reserve details";

  return (
    <Flex
      flexDir="column"
      justifyItems="stretch"
      height="auto"
      marginRight="auto"
    >
      <BorrowTitle>
        <ColoredText className="borrowTitle" fontSize="5xl">
          {props.match.params.assetName ?? "-"} {title}
        </ColoredText>
      </BorrowTitle>
      <Text align="left" fontSize="3xl">
        {`/${message}`}
      </Text>
    </Flex>
  );
}

export default withRouter(ReserveBanner);
