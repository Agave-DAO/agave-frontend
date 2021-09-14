import React from "react";
import { withRouter, useHistory, useRouteMatch } from "react-router-dom";
import ReserveInfo from "./ReserveInfo";
import UserInfo from "./UserInfo";
import { useAllReserveTokens } from "../../queries/allReserveTokens";
import ColoredText from "../../components/ColoredText";
import { Button } from "@chakra-ui/button";
import { Center, Container, Flex } from "@chakra-ui/react";
import { useNativeSymbols } from "../../utils/icons";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";
/*
Agave Asset Page Notes | React Template Edited by Pauly Sun 🌞 July 15th, 2021 
✔ Completed Seperated & Rebuilt Component Tree | July 7th, 2021
✔ Completed ChakraUI & JS to TSX Conversion | July 8th, 2021
✔ Completed ChakraUI Mobile Ready Components | July 9th, 2021
✔ Added a new layout solution to allow for scrolling while containing the flower | July 13th, 2021
✔ Most Query Injections Done | July 14/15th, 2021
✔ Connected to markets page | July 15th, 2021 
Todos... 
1) *30dayAvergaes, %overTotal, Injection  
2) ** Populate Tooltips 
*/

const ReserveOverview: React.FC = () => {
  const match =
    useRouteMatch<{
      assetName: string;
    }>();

  const history = useHistory();
  const assetName = match.params.assetName;
  const allReserves = useAllReserveTokens();
  const nativeSymbols = useNativeSymbols();
  const asset = React.useMemo(() => {
    const asset = allReserves.data?.find(
      asset =>
        asset.symbol.toLowerCase() ===
        nativeSymbols.wrappednative?.toLowerCase()
    );
    return asset && nativeSymbols.wrappednative === asset.symbol
      ? { ...asset, symbol: nativeSymbols.native }
      : asset;
  }, [allReserves, assetName]);

  return (
    <Container maxWidth="100%" p="0">
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
          <Flex flexDirection={{ base: "column", lg: "row" }}>
            <ReserveInfo asset={asset} />
            <UserInfo asset={asset} history={history} />
          </Flex>
        )}
      </React.Fragment>
    </Container>
  );
};

export default withRouter(ReserveOverview);
