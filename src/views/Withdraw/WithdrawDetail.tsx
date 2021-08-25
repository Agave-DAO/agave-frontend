import React from "react";
import { VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useHistory, useRouteMatch } from "react-router-dom";
import { WithdrawDash } from "./WithdrawDash";
import { DashOverviewIntro } from "../common/DashOverview";
import {
  isNativeTokenDefinition,
  isReserveTokenDefinition,
  NATIVE_TOKEN,
  ReserveOrNativeTokenDefinition,
  ReserveTokenDefinition,
  useTokenDefinitionBySymbol,
} from "../../queries/allReserveTokens";
import { Box, Center, Text } from "@chakra-ui/react";
import ColoredText from "../../components/ColoredText";
import { BigNumber } from "ethers";
import { OneTaggedPropertyOf, PossibleTags } from "../../utils/types";
import { useUserAssetBalance } from "../../queries/userAssets";
import { bigNumberToString } from "../../utils/fixedPoint";
import { ControllerItem } from "../../components/ControllerItem";
import {
  useWithdrawMutation,
  UseWithdrawMutationProps,
} from "../../mutations/withdraw";
import { StepperBar, WizardOverviewWrapper } from "../common/Wizard";
import { useLendingReserveData } from "../../queries/lendingReserveData";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { useChainAddresses } from "../../utils/chainAddresses";
import { useWrappedNativeDefinition } from "../../queries/wrappedNativeAddress";
import {
  useApprovalMutation,
  UseApprovalMutationProps,
} from "../../mutations/approval";

interface InitialState {
  token: Readonly<ReserveOrNativeTokenDefinition>;
}

interface AmountSelectedState extends InitialState {
  amountToWithdraw: BigNumber;
}

interface WithdrawTXState extends AmountSelectedState {
  // approvalTXHash: string | undefined;
}

interface WithdrawnTXState extends WithdrawTXState {
  // withdrawTXHash: string;
}

type WithdrawState = OneTaggedPropertyOf<{
  init: InitialState;
  amountSelected: AmountSelectedState;
  withdrawTx: WithdrawTXState;
  withdrawnTx: WithdrawnTXState;
}>;

function createState<SelectedState extends PossibleTags<WithdrawState>>(
  type: SelectedState,
  value: WithdrawState[SelectedState]
): WithdrawState {
  return {
    type,
    [type]: value,
  } as any;
}

const stateNames: Record<PossibleTags<WithdrawState>, string> = {
  init: "Token",
  amountSelected: "Approval",
  withdrawTx: "Withdraw",
  withdrawnTx: "Withdrawn",
};

const visibleStateNames: ReadonlyArray<PossibleTags<WithdrawState>> = [
  "amountSelected",
  "withdrawTx",
  "withdrawnTx",
] as const;

const WithdrawTitle = "Withdraw overview";

export interface WithdrawBannerProps {}

export const WithdrawBanner: React.FC<{}> = () => {
  const history = useHistory();
  return (
    <Center width="100%" justifyContent="space-between">
      <Text
        fontWeight="bold"
        color="white"
        fontSize={{ base: "1.8rem", md: "2.4rem" }}
        onClick={() => history.push("/dashboard")}
      >
        Withdraw
      </Text>
    </Center>
  );
};

const InitialComp: React.FC<{
  state: InitialState;
  dispatch: (nextState: WithdrawState) => void;
}> = ({ state, dispatch }) => {
  const [amount, setAmount] = React.useState<BigNumber>();
  const { data: wNative } = useWrappedNativeDefinition();
  const asset =
    state.token.tokenAddress === NATIVE_TOKEN ? wNative : state.token;
  const { data: reserve } = useLendingReserveData(asset?.tokenAddress);
  const { data: userAgBalance } = useUserAssetBalance(reserve?.aTokenAddress);
  const onSubmit = React.useCallback(
    amountToWithdraw =>
      dispatch(createState("amountSelected", { amountToWithdraw, ...state })),
    [state, dispatch]
  );
  return (
    <DashOverviewIntro
      asset={state.token}
      amount={amount}
      setAmount={setAmount}
      mode="withdraw"
      onSubmit={onSubmit}
      balance={userAgBalance}
    />
  );
};

const AmountSelectedComp: React.FC<{
  state: AmountSelectedState;
  dispatch: (nextState: WithdrawState) => void;
}> = ({ state, dispatch }) => {
  const chainAddresses = useChainAddresses();
  const { data: wNative } = useWrappedNativeDefinition();
  const asset =
    state.token.tokenAddress === NATIVE_TOKEN ? wNative : state.token;
  const { data: reserve } = useLendingReserveData(asset?.tokenAddress);
  const approvalArgs = React.useMemo<UseApprovalMutationProps>(
    () => ({
      asset: isReserveTokenDefinition(state.token)
        ? state.token.tokenAddress
        : reserve?.aTokenAddress,
      amount: state.amountToWithdraw,
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
      .then(() => dispatch(createState("withdrawTx", { ...state })))
      // TODO: Switch to an error-display state that returns to init
      .catch(e => dispatch(createState("init", state)));
  }, [state, dispatch, mutateAsync]);
  const currentStep: PossibleTags<WithdrawState> = "amountSelected";
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
      title={WithdrawTitle}
      amount={state.amountToWithdraw}
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

const WithdrawTxComp: React.FC<{
  state: WithdrawTXState;
  dispatch: (nextState: WithdrawState) => void;
}> = ({ state, dispatch }) => {
  const { account } = useAppWeb3();
  const chainAddresses = useChainAddresses();
  const withdrawArgs = React.useMemo<UseWithdrawMutationProps>(
    () => ({
      asset: state.token.tokenAddress,
      amount: state.amountToWithdraw,
      recipientAccount: account ?? undefined,
      spender: isReserveTokenDefinition(state.token)
        ? chainAddresses?.lendingPool
        : chainAddresses?.wrappedNativeGateway,
    }),
    [state, account]
  );
  const {
    withdrawMutation: { mutateAsync },
  } = useWithdrawMutation(withdrawArgs);
  const onSubmit = React.useCallback(() => {
    mutateAsync()
      .then(() => dispatch(createState("withdrawnTx", { ...state })))
      // TODO: Switch to an error-display state that returns to init
      .catch(e => dispatch(createState("init", state)));
  }, [state, dispatch, mutateAsync]);
  const currentStep: PossibleTags<WithdrawState> = "withdrawTx";
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
      title={WithdrawTitle}
      amount={state.amountToWithdraw}
      asset={state.token}
      collateral={true}
      increase={false}
    >
      {stepperBar}
      <ControllerItem
        stepNumber={1}
        stepName="Withdraw"
        stepDesc="Please submit to withdraw"
        actionName="Withdraw"
        onActionClick={onSubmit}
        totalSteps={visibleStateNames.length}
      />
    </WizardOverviewWrapper>
  );
};

const WithdrawnTxComp: React.FC<{
  state: WithdrawnTXState;
  dispatch: (nextState: WithdrawState) => void;
}> = ({ state, dispatch }) => {
  const history = useHistory();
  const currentStep: PossibleTags<WithdrawState> = "withdrawnTx";
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
      title={WithdrawTitle}
      amount={state.amountToWithdraw}
      asset={state.token}
      collateral={true}
      increase={false}
    >
      {stepperBar}
      <ControllerItem
        stepNumber={2}
        stepName="Withdrawn"
        stepDesc={`Withdraw of ${bigNumberToString(state.amountToWithdraw)} ${
          state.token.symbol
        } successful`}
        actionName="Finish"
        onActionClick={() => history.push("/dashboard")}
        totalSteps={visibleStateNames.length}
      />
    </WizardOverviewWrapper>
  );
};

const WithdrawStateMachine: React.FC<{
  state: WithdrawState;
  setState: (newState: WithdrawState) => void;
}> = ({ state, setState }) => {
  switch (state.type) {
    case "init":
      return <InitialComp state={state.init} dispatch={setState} />;
    case "amountSelected":
      return (
        <AmountSelectedComp state={state.amountSelected} dispatch={setState} />
      );
    case "withdrawTx":
      return <WithdrawTxComp state={state.withdrawTx} dispatch={setState} />;
    case "withdrawnTx":
      return <WithdrawnTxComp state={state.withdrawnTx} dispatch={setState} />;
  }
};

const WithdrawDetailForAsset: React.FC<{
  asset: ReserveOrNativeTokenDefinition;
}> = ({ asset }) => {
  const dash = React.useMemo(() => <WithdrawDash token={asset} />, [asset]);

  const [withdrawState, setWithdrawState] = React.useState<WithdrawState>(
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
        <WithdrawStateMachine
          state={withdrawState}
          setState={setWithdrawState}
        />
      </Center>
    </VStack>
  );
};

export const WithdrawDetail: React.FC = () => {
  const match = useRouteMatch<{
    assetName: string | undefined;
  }>();
  const history = useHistory();
  const assetName = match.params.assetName;
  const {
    allReserves,
    token: asset,
    wrappedNativeToken,
  } = useTokenDefinitionBySymbol(assetName);
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
              history.length > 0 ? history.goBack() : history.push("/dashboard")
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
  return <WithdrawDetailForAsset asset={asset} />;
};
