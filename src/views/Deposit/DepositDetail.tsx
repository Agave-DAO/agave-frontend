import React from "react";
import { VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useHistory, useRouteMatch, withRouter } from "react-router-dom";
import DepositDash from "../common/DepositDash";
import DashOverview from "../common/DashOverview";
import { useAllReserveTokens } from "../../queries/allReserveTokens";
import { Box, Center } from "@chakra-ui/react";
import ColoredText from "../../components/ColoredText";

const DepositDetail: React.FC = () => {
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
  const dash = React.useMemo(
    () => (asset ? <DepositDash token={asset} /> : undefined),
    [asset]
  );

  if (!asset) {
    return (
      <Box
        w="100%"
        color="primary.100"
        bg="primary.900"
        rounded="lg"
        padding="1em"
      >
        <Center>
          {allReserves.data ? (
            <>
              No reserve found with asset symbol&nbsp;
              <ColoredText>{assetName}</ColoredText>
            </>
          ) : (
            "Loading reserves..."
          )}
        </Center>
        <Center>
          <Button
            color="primary.100"
            bg="primary.500"
            onClick={() =>
              history.length > 0 ? history.goBack() : history.push("/deposit")
            }
            size="xl"
            padding="1rem"
          >
            Take me back!
          </Button>
        </Center>
      </Box>
    );
  }

  return (
    <VStack color="white" spacing="3.5rem" mt="3.5rem" minH="65vh">
      {dash}
      <DashOverview mode="deposit" />
    </VStack>
  );
};

export default withRouter(DepositDetail);
