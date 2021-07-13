import React from "react";
import { withRouter, useHistory, useRouteMatch } from "react-router-dom";
import ReserveInfo from "./ReserveInfo";
import UserInfo from "./UserInfo";
import { useAllReserveTokens } from "../../queries/allReserveTokens";
import ColoredText from "../../components/ColoredText";
import { Button } from "@chakra-ui/button";
import { Center, Container, Flex } from "@chakra-ui/react";
/*
Agave Asset Page Notes | React Template Edited by Pauly Sun 🌞 July 9th, 2021 TODO update
✔ Completed Seperated & Rebuilt Component Tree | July 7th, 2021
✔ Completed ChakraUI & JS to TSX Conversion | July 8th, 2021
✔ Completed ChakraUI Mobile Ready Components | July 9th, 2021
Todos... 
1) *Query Injection IN progress 
2) **Needs to be connected to markets page through router links, currently works by manually typing url EG: 
/reserve-overview/WETH
3) *** Stable coin borrowing componentes ready when implemented
*/

const ReserveOverview: React.FC = () => {
  const match =
    useRouteMatch<{
      assetName: string | undefined;
    }>();

  const history = useHistory();
  const assetName = match.params.assetName;
  const allReserves = useAllReserveTokens();
  const asset = React.useMemo(
    () =>
      assetName === undefined
        ? undefined
        : allReserves?.data?.find(
            asset => asset.symbol.toLowerCase() === assetName?.toLowerCase()
          ),
    [allReserves, assetName]
  );

  return (
    <Container maxWidth="100%">
      <React.Fragment>
        {!asset && asset === undefined && (
          <Center display="block">
            <ColoredText
              pt="1rem"
              textAlign="center"
            >{`No reserve found called ${assetName}`}</ColoredText>
            <Center>
              <Button
                color="primary.100"
                bg="primary.500"
                onClick={() =>
                  history.length > 0
                    ? history.goBack()
                    : history.push("/markets")
                }
                size="xl"
                padding="1rem"
                margin="1rem"
              >
                Take me back!
              </Button>
            </Center>
          </Center>
        )}
      </React.Fragment>
      <React.Fragment>
        {asset && (
          <Flex flexDirection={{ base: "column", xl: "row" }}>
            <ReserveInfo asset={asset} />
            <UserInfo asset={asset} history={history} />
          </Flex>
        )}
      </React.Fragment>
    </Container>
  );
};

export default withRouter(ReserveOverview);
