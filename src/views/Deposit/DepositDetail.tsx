import React from "react";
import { VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useHistory, useRouteMatch } from "react-router-dom";
import { DepositDash } from "./DepositDash";
import { DashOverviewIntro } from "../common/DashOverview";
import {
  ReserveOrNativeTokenDefinition,
  isReserveTokenDefinition,
  useAllReserveTokens,
} from "../../queries/allReserveTokens";
import { Box, Center } from "@chakra-ui/react";
import ColoredText from "../../components/ColoredText";
import { BigNumber } from "ethers";
import { OneTaggedPropertyOf, PossibleTags } from "../../utils/types";
import { useUserAssetBalance } from "../../queries/userAssets";
import { bigNumberToString } from "../../utils/fixedPoint";
import {
  useApprovalMutation,
  UseApprovalMutationProps,
} from "../../mutations/approval";
import { useChainAddresses } from "../../utils/chainAddresses";
import { ControllerItem } from "../../components/ControllerItem";
import {
  useDepositMutation,
  UseDepositMutationProps,
} from "../../mutations/deposit";
import { StepperBar, WizardOverviewWrapper } from "../common/Wizard";

interface InitialState {
  token: Readonly<ReserveOrNativeTokenDefinition>;
}

interface AmountSelectedState extends InitialState {
  amountToDeposit: BigNumber;
}

interface DepositTXState extends AmountSelectedState {
  // approvalTXHash: string | undefined;
}

interface DepositedTXState extends DepositTXState {
  // depositTXHash: string;
}

type DepositState = OneTaggedPropertyOf<{
  init: InitialState;
  amountSelected: AmountSelectedState;
  depositTx: DepositTXState;
  depositedTx: DepositedTXState;
}>;

function createState<SelectedState extends PossibleTags<DepositState>>(
  type: SelectedState,
  value: DepositState[SelectedState]
): DepositState {
  return {
    type,
    [type]: value,
  } as any;
}

const stateNames: Record<PossibleTags<DepositState>, string> = {
  init: "Token",
  amountSelected: "Approval",
  depositTx: "Deposit",
  depositedTx: "Deposited",
};

const visibleStateNames: ReadonlyArray<PossibleTags<DepositState>> = [
  "amountSelected",
  "depositTx",
  "depositedTx",
] as const;

const DepositTitle = "Deposit overview";

const InitialComp: React.FC<{
  state: InitialState;
  dispatch: (nextState: DepositState) => void;
}> = ({ state, dispatch }) => {
  const [amount, setAmount] = React.useState<BigNumber>();
  const { data: userBalance } = useUserAssetBalance(state.token);
  const onSubmit = React.useCallback(
    amountToDeposit =>
      dispatch(createState("amountSelected", { amountToDeposit, ...state })),
    [state, dispatch]
  );
  return (
    <DashOverviewIntro
      asset={state.token}
      amount={amount}
      setAmount={setAmount}
      mode="deposit"
      onSubmit={onSubmit}
      balance={userBalance}
    />
  );
};

const AmountSelectedComp: React.FC<{
  state: AmountSelectedState;
  dispatch: (nextState: DepositState) => void;
}> = ({ state, dispatch }) => {
  const chainAddresses = useChainAddresses();
  const approvalArgs = React.useMemo<UseApprovalMutationProps>(
    () => ({
      asset: isReserveTokenDefinition(state.token)
        ? state.token.tokenAddress
        : undefined,
      amount: state.amountToDeposit,
      spender: isReserveTokenDefinition(state.token)
        ? chainAddresses?.lendingPool
        : chainAddresses?.wrappedNativeGateway,
    }),
    [state, chainAddresses?.lendingPool, chainAddresses?.wrappedNativeGateway]
  );
  const {
    approvalMutation: { mutateAsync },
  } = useApprovalMutation(approvalArgs);
  const onSubmit = React.useCallback(() => {
    mutateAsync()
      .then(() => dispatch(createState("depositTx", { ...state })))
      // TODO: Switch to an error-display state that returns to init
      .catch(e => dispatch(createState("init", state)));
  }, [state, dispatch, mutateAsync]);
  const currentStep: PossibleTags<DepositState> = "amountSelected";
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
      title={DepositTitle}
      amount={state.amountToDeposit}
      asset={state.token}
      collateral={true}
      increase={true}
    >
      {stepperBar}
      <ControllerItem
        stepNumber={1}
        stepName="Approval"
        stepDesc="Please submit to approve"
        actionName="Approve"
        onActionClick={onSubmit}
        totalSteps={visibleStateNames.length}
      />
    </WizardOverviewWrapper>
  );
};

const DepositTxComp: React.FC<{
  state: DepositTXState;
  dispatch: (nextState: DepositState) => void;
}> = ({ state, dispatch }) => {
  const chainAddresses = useChainAddresses();
  const depositArgs = React.useMemo<UseDepositMutationProps>(
    () => ({
      asset: state.token.tokenAddress,
      amount: state.amountToDeposit,
      spender: isReserveTokenDefinition(state.token)
        ? chainAddresses?.lendingPool
        : chainAddresses?.wrappedNativeGateway,
    }),
    [state, chainAddresses?.lendingPool, chainAddresses?.wrappedNativeGateway]
  );
  const {
    depositMutation: { mutateAsync },
  } = useDepositMutation(depositArgs);
  const onSubmit = React.useCallback(() => {
    mutateAsync()
      .then(() => dispatch(createState("depositedTx", { ...state })))
      // TODO: Switch to an error-display state that returns to init
      .catch(e => dispatch(createState("init", state)));
  }, [state, dispatch, mutateAsync]);
  const currentStep: PossibleTags<DepositState> = "depositTx";
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
      title={DepositTitle}
      amount={state.amountToDeposit}
      asset={state.token}
      collateral={true}
      increase={true}
    >
      {stepperBar}
      <ControllerItem
        stepNumber={2}
        stepName="Deposit"
        stepDesc="Please submit to deposit"
        actionName="Deposit"
        onActionClick={onSubmit}
        totalSteps={visibleStateNames.length}
      />
    </WizardOverviewWrapper>
  );
};

const DepositedTxComp: React.FC<{
  state: DepositedTXState;
  dispatch: (nextState: DepositState) => void;
}> = ({ state, dispatch }) => {
  const history = useHistory();
  const currentStep: PossibleTags<DepositState> = "depositedTx";
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
      title={DepositTitle}
      amount={state.amountToDeposit}
      asset={state.token}
      collateral={true}
      increase={true}
    >
      {stepperBar}
      <ControllerItem
        stepNumber={3}
        stepName="Deposited"
        stepDesc={`Deposit of ${bigNumberToString(state.amountToDeposit)} ${
          state.token.symbol
        } successful`}
        actionName="Finish"
        onActionClick={() => history.push("/dashboard")}
        totalSteps={visibleStateNames.length}
      />
    </WizardOverviewWrapper>
  );
};

const DepositStateMachine: React.FC<{
  state: DepositState;
  setState: (newState: DepositState) => void;
}> = ({ state, setState }) => {
  switch (state.type) {
    case "init":
      return <InitialComp state={state.init} dispatch={setState} />;
    case "amountSelected":
      return (
        <AmountSelectedComp state={state.amountSelected} dispatch={setState} />
      );
    case "depositTx":
      return <DepositTxComp state={state.depositTx} dispatch={setState} />;
    case "depositedTx":
      return <DepositedTxComp state={state.depositedTx} dispatch={setState} />;
  }
};

const DepositDetailForAsset: React.FC<{
  asset: ReserveOrNativeTokenDefinition;
}> = ({ asset }) => {
  const dash = React.useMemo(
    () =>
      asset && isReserveTokenDefinition(asset) ? (
        <DepositDash token={asset} />
      ) : undefined,
    [asset]
  );
  const [depositState, setDepositState] = React.useState<DepositState>(
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
        <DepositStateMachine state={depositState} setState={setDepositState} />
      </Center>
    </VStack>
  );
};

export const DepositDetail: React.FC = () => {
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
            m="3rem"
          >
            Take me back!
          </Button>
        </Center>
      </Box>
    );
  }
  return <DepositDetailForAsset asset={asset} />;
};
