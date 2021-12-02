import React from "react";
import { VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useHistory, useRouteMatch } from "react-router-dom";
import { BorrowDash } from "./BorrowDash";
import { DashOverviewIntro } from "../common/DashOverview";
import {
  isReserveTokenDefinition,
  NATIVE_TOKEN,
  ReserveOrNativeTokenDefinition,
  useTokenDefinitionBySymbol,
} from "../../queries/allReserveTokens";
import { Box, Center, Text } from "@chakra-ui/react";
import ColoredText from "../../components/ColoredText";
import { BigNumber } from "ethers";
import { OneTaggedPropertyOf, PossibleTags } from "../../utils/types";
import { formatEther } from "ethers/lib/utils";
import { ControllerItem } from "../../components/ControllerItem";
import {
  useBorrowMutation,
  UseBorrowMutationProps,
} from "../../mutations/borrow";
import { StepperBar, WizardOverviewWrapper } from "../common/Wizard";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { useAvailableToBorrowAssetWei } from "../../queries/userAccountData";
import {
  useWrappedNativeAddress,
  useWrappedNativeDefinition,
} from "../../queries/wrappedNativeAddress";
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { useChainAddresses } from "../../utils/chainAddresses";
import {
  useApproveDelegationMutation,
  UseApproveDelegationMutationProps,
} from "../../mutations/approveDelegation";
import { useLendingReserveData } from "../../queries/lendingReserveData";
import { bigNumberToString } from "../../utils/fixedPoint";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";

interface InitialState {
  token: Readonly<ReserveOrNativeTokenDefinition>;
}

interface AmountSelectedState extends InitialState {
  amountToBorrow: BigNumber;
}

interface BorrowTXState extends AmountSelectedState {
  // approvalTXHash: string | undefined;
}

interface BorrowedTXState extends BorrowTXState {
  // borrowTXHash: string;
}

type BorrowState = OneTaggedPropertyOf<{
  init: InitialState;
  amountSelected: AmountSelectedState;
  borrowTx: BorrowTXState;
  borrowedTx: BorrowedTXState;
}>;

function createState<SelectedState extends PossibleTags<BorrowState>>(
  type: SelectedState,
  value: BorrowState[SelectedState]
): BorrowState {
  return {
    type,
    [type]: value,
  } as any;
}

// THIS BorrowState IS ALL WRONG AND NEEDS FIXING WHEN THE QUERIES ARE DONE
const stateNames: Record<PossibleTags<BorrowState>, string> = {
  init: "Token",
  amountSelected: "Delegate",
  borrowTx: "Borrow",
  borrowedTx: "Borrowed",
};

const visibleStateNames: ReadonlyArray<PossibleTags<BorrowState>> = [
  "amountSelected",
  "borrowTx",
  "borrowedTx",
] as const;

const BorrowTitle = "Borrow overview";

export interface BorrowBannerProps {}

export const BorrowBanner: React.FC<{}> = () => {
  const history = useHistory();
  return (
    <Center width="100%" justifyContent="space-between">
      <Text
        fontWeight="bold"
        color="white"
        fontSize={{ base: "1.8rem", md: "2.4rem" }}
        onClick={() => history.push("/borrow")}
      >
        Borrow
      </Text>
    </Center>
  );
};

const InitialComp: React.FC<{
  state: InitialState;
  dispatch: (nextState: BorrowState) => void;
}> = ({ state, dispatch }) => {
  const [amount, setAmount] = React.useState<BigNumber>();
  const { account } = useAppWeb3();
  const { data: wNative } = useWrappedNativeDefinition();
  const asset =
    state.token.tokenAddress === NATIVE_TOKEN ? wNative : state.token;

  const { data: reserveProtocolData } = useProtocolReserveData(
    asset?.tokenAddress
  );
  const userAssetMaxAvailable =
    useAvailableToBorrowAssetWei(account ?? undefined, asset?.tokenAddress)
      .data ?? undefined;
  const liquidityAvailable = reserveProtocolData?.availableLiquidity;
  const maxToBorrow =
    liquidityAvailable && userAssetMaxAvailable?.gt(liquidityAvailable)
      ? liquidityAvailable
      : userAssetMaxAvailable;
  const onSubmit = React.useCallback(
    amountToBorrow => {
      isReserveTokenDefinition(state.token)
        ? dispatch(createState("borrowTx", { amountToBorrow, ...state }))
        : dispatch(createState("amountSelected", { amountToBorrow, ...state }));
    },
    [state, dispatch]
  );
  return (
    <DashOverviewIntro
      asset={state.token}
      amount={amount}
      setAmount={setAmount}
      mode="borrow"
      onSubmit={onSubmit}
      balance={maxToBorrow}
    />
  );
};

const AmountSelectedComp: React.FC<{
  state: AmountSelectedState;
  dispatch: (nextState: BorrowState) => void;
}> = ({ state, dispatch }) => {
  const chainAddresses = useChainAddresses();
  const wrappedNativeAddress = useWrappedNativeAddress().data;
  const reserveData = useLendingReserveData(wrappedNativeAddress).data;
  const approvalArgs = React.useMemo<UseApproveDelegationMutationProps>(
    () => ({
      asset: reserveData?.variableDebtTokenAddress,
      amount: state.amountToBorrow,
      spender: chainAddresses?.wrappedNativeGateway,
    }),
    [state, chainAddresses?.lendingPool, chainAddresses?.wrappedNativeGateway]
  );
  const {
    approvalMutation: { mutateAsync },
  } = useApproveDelegationMutation(approvalArgs);
  const onSubmit = React.useCallback(() => {
    mutateAsync()
      .then(() => dispatch(createState("borrowTx", { ...state })))
      // TODO: Switch to an error-display state that returns to init
      .catch(e => dispatch(createState("init", state)));
  }, [state, dispatch, mutateAsync]);
  const currentStep: PossibleTags<BorrowState> = "amountSelected";
  const stepperBar = React.useMemo(
    () => (
      <StepperBar
        states={visibleStateNames}
        currentState={currentStep}
        stateNames={stateNames}
      />
    ),
    [currentStep]
  );
  return (
    <WizardOverviewWrapper
      title={BorrowTitle}
      amount={state.amountToBorrow}
      asset={state.token}
      collateral={true}
      increase={true}
    >
      {stepperBar}
      <ControllerItem
        stepNumber={1}
        stepName="Delegate"
        stepDesc="Submit to delegate approval to WETHGateway"
        actionName="Approve"
        onActionClick={onSubmit}
        totalSteps={visibleStateNames.length}
      />
    </WizardOverviewWrapper>
  );
};

/*
 ##
 ## Requires fixing the Props with the nex Queries and Mutations for Borrow support
 ##
*/

const BorrowTxComp: React.FC<{
  state: BorrowTXState;
  dispatch: (nextState: BorrowState) => void;
}> = ({ state, dispatch }) => {
  const { account } = useAppWeb3();
  const borrowArgs = React.useMemo<UseBorrowMutationProps>(
    () => ({
      asset: state.token.tokenAddress,
      amount: state.amountToBorrow,
      onBehalfOf: account ?? undefined,
    }),
    [state, account]
  );
  const {
    borrowMutation: { mutateAsync },
  } = useBorrowMutation(borrowArgs);
  const onSubmit = React.useCallback(() => {
    mutateAsync()
      .then(() => dispatch(createState("borrowedTx", { ...state })))
      // TODO: Switch to an error-display state that returns to init
      .catch(e => dispatch(createState("init", state)));
  }, [state, dispatch, mutateAsync]);
  const currentStep: PossibleTags<BorrowState> = "borrowTx";
  const stepperBar = React.useMemo(
    () => (
      <StepperBar
        states={visibleStateNames}
        currentState={currentStep}
        stateNames={stateNames}
      />
    ),
    [currentStep]
  );
  return (
    <WizardOverviewWrapper
      title={BorrowTitle}
      amount={state.amountToBorrow}
      asset={state.token}
      collateral={false}
      increase={true}
    >
      {stepperBar}
      <ControllerItem
        stepNumber={1}
        stepName="Borrow"
        stepDesc="Please submit to borrow"
        actionName="Borrow"
        onActionClick={onSubmit}
        totalSteps={visibleStateNames.length}
      />
    </WizardOverviewWrapper>
  );
};

const BorrowedTxComp: React.FC<{
  state: BorrowedTXState;
  dispatch: (nextState: BorrowState) => void;
}> = ({ state, dispatch }) => {
  const history = useHistory();
  const currentStep: PossibleTags<BorrowState> = "borrowedTx";
  const decimals = useDecimalCountForToken(state.token.tokenAddress).data;
  const stepperBar = React.useMemo(
    () => (
      <StepperBar
        states={visibleStateNames}
        currentState={currentStep}
        stateNames={stateNames}
      />
    ),
    [currentStep]
  );
  return (
    <WizardOverviewWrapper
      title={BorrowTitle}
      amount={state.amountToBorrow}
      asset={state.token}
      collateral={false}
      increase={true}
    >
      {stepperBar}
      <ControllerItem
        stepNumber={2}
        stepName="Borrowed"
        stepDesc={`Borrow of ${bigNumberToString(
          state.amountToBorrow,
          4,
          decimals
        )} ${state.token.symbol} successful`}
        actionName="Finish"
        onActionClick={() => history.push("/dashboard")}
        totalSteps={visibleStateNames.length}
      />
    </WizardOverviewWrapper>
  );
};

const BorrowStateMachine: React.FC<{
  state: BorrowState;
  setState: (newState: BorrowState) => void;
}> = ({ state, setState }) => {
  switch (state.type) {
    case "init":
      return <InitialComp state={state.init} dispatch={setState} />;
    case "amountSelected":
      return (
        <AmountSelectedComp state={state.amountSelected} dispatch={setState} />
      );
    case "borrowTx":
      return <BorrowTxComp state={state.borrowTx} dispatch={setState} />;
    case "borrowedTx":
      return <BorrowedTxComp state={state.borrowedTx} dispatch={setState} />;
  }
};
/*
END IMPL SECTION
*/

const BorrowDetailForAsset: React.FC<{
  asset: ReserveOrNativeTokenDefinition;
}> = ({ asset }) => {
  const dash = React.useMemo(() => <BorrowDash token={asset} />, [asset]);

  const [borrowState, setBorrowState] = React.useState<BorrowState>(
    createState("init", { token: asset })
  );

  return (
    <VStack color="white" spacing="3.5rem" mt="3.5rem" minH="65vh">
      {dash}
      <Center
        w="100%"
        color="primary.100"
        bg="primary.900"
        rounded="lg"
        padding="1em"
      >
        <BorrowStateMachine state={borrowState} setState={setBorrowState} />
      </Center>
    </VStack>
  );
};

export const BorrowDetail: React.FC = () => {
  const match =
    useRouteMatch<{
      assetName: string | undefined;
    }>();
  const history = useHistory();
  const assetName = match.params.assetName;
  const { allReserves, token: asset } = useTokenDefinitionBySymbol(assetName);
  if (!asset) {
    return (
      <Box
        w="100%"
        color="primary.100"
        bg="primary.900"
        rounded="lg"
        padding="3em"
      >
        <Center>
          {allReserves ? (
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
              history.length > 0 ? history.goBack() : history.push("/borrow")
            }
            size="xl"
            padding="1rem"
            m="3rem"
          >
            Take me back!
          </Button>
        </Center>
      </Box>
    );
  }
  return <BorrowDetailForAsset asset={asset} />;
};
