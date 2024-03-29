import React from "react";
import { VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useHistory, useRouteMatch } from "react-router-dom";
import { RepayDash } from "./RepayDash";
import { DashOverviewIntro } from "../common/DashOverview";
import {
  NATIVE_TOKEN,
  ReserveOrNativeTokenDefinition,
  useTokenDefinitionBySymbol,
} from "../../queries/allReserveTokens";
import { Box, Center } from "@chakra-ui/react";
import ColoredText from "../../components/ColoredText";
import { BigNumber, constants } from "ethers";
import { OneTaggedPropertyOf, PossibleTags } from "../../utils/types";
import {
  useUserAssetBalance,
  useUserStableAndVariableDebtForAsset,
} from "../../queries/userAssets";
import { useRepayMutation, UseRepayMutationProps } from "../../mutations/repay";
import {
  useApprovalMutation,
  UseApprovalMutationProps,
} from "../../mutations/approval";
import { useChainAddresses } from "../../utils/chainAddresses";
import { ControllerItem } from "../../components/ControllerItem";
import { StepperBar, WizardOverviewWrapper } from "../common/Wizard";
import { useWrappedNativeDefinition } from "../../queries/wrappedNativeAddress";
import { MINIMUM_NATIVE_RESERVE } from "../../utils/constants";
import { bnMax, bnMin } from "../../utils/helpers";

interface InitialState {
  token: Readonly<ReserveOrNativeTokenDefinition>;
  borrowMode: Readonly<number>;
}

interface AmountSelectedState extends InitialState {
  amountToRepay: BigNumber;
}

interface RepayTXState extends AmountSelectedState {
  // approvalTXHash: string;
}

interface RepaidTXState extends RepayTXState {
  // repayTXHash: string;
}

type RepayState = OneTaggedPropertyOf<{
  init: InitialState;
  amountSelected: AmountSelectedState;
  repayTx: RepayTXState;
  repaidTx: RepaidTXState;
}>;

function createState<SelectedState extends PossibleTags<RepayState>>(
  type: SelectedState,
  value: RepayState[SelectedState]
): RepayState {
  return {
    type,
    [type]: value,
  } as any;
}

const stateNames: Record<PossibleTags<RepayState>, string> = {
  init: "Token",
  amountSelected: "Approval",
  repayTx: "Repayment",
  repaidTx: "Finished",
};

const visibleStateNames: ReadonlyArray<PossibleTags<RepayState>> = [
  "amountSelected",
  "repayTx",
  "repaidTx",
] as const;

const RepayTitle = "Repay overview";

const InitialComp: React.FC<{
  state: InitialState;
  dispatch: (nextState: RepayState) => void;
}> = ({ state, dispatch }) => {
  const [amount, setAmount] = React.useState<BigNumber>();
  const { data: wNative } = useWrappedNativeDefinition();
  const paymentAssetIsNative = state.token.tokenAddress === NATIVE_TOKEN;
  const asset =
    state.token.tokenAddress === NATIVE_TOKEN ? wNative : state.token;

  const { data: userBalance } = useUserAssetBalance(state.token.tokenAddress);
  const { data: debts } = useUserStableAndVariableDebtForAsset(
    asset?.tokenAddress
  );
  const debtForAsset =
    state.borrowMode === 1 ? debts?.stableDebt : debts?.variableDebt;

  const availableToRepay: BigNumber | undefined = React.useMemo(() => {
    // If either are null, we can't provide anything useful
    // Propagating undefined lets the DashOverviewIntro know we're still loading the value
    if (userBalance === undefined || debtForAsset === undefined) {
      return undefined;
    }
    // Start with the user's debt
    let maxRepaymentAmount = debtForAsset;
    // 0.05% extra to ensure sufficient coverage for interest accrued during the time between fetching and repaying
    // (difference gets minted as agToken)
    // TODO: Change this to a time-based multiplier of APR, for example, 10 minutes worth of interest
    maxRepaymentAmount = maxRepaymentAmount.gt(0)
      ? maxRepaymentAmount.add(MINIMUM_NATIVE_RESERVE).mul(2001).div(2000)
      : maxRepaymentAmount;
    // Max repayment amount cannot be negative
    maxRepaymentAmount = bnMin(maxRepaymentAmount, userBalance);
    maxRepaymentAmount = bnMax(maxRepaymentAmount, constants.Zero);
    return maxRepaymentAmount;
  }, [debtForAsset, userBalance, paymentAssetIsNative]);

  const onSubmit = React.useCallback(
    amountToRepay =>
      dispatch(createState("amountSelected", { amountToRepay, ...state })),
    [state, dispatch]
  );
  return (
    <DashOverviewIntro
      asset={state.token}
      amount={amount}
      setAmount={setAmount}
      mode="repay"
      onSubmit={onSubmit}
      balance={availableToRepay}
      borrowMode={state.borrowMode}
    />
  );
};

const AmountSelectedComp: React.FC<{
  state: AmountSelectedState;
  dispatch: (nextState: RepayState) => void;
}> = ({ state, dispatch }) => {
  const chainAddresses = useChainAddresses();

  const approvalArgs = React.useMemo<UseApprovalMutationProps>(
    () => ({
      asset:
        state.token.tokenAddress === NATIVE_TOKEN
          ? undefined
          : state.token.tokenAddress,
      amount: state.amountToRepay,
      spender: chainAddresses?.lendingPool,
    }),
    [state, chainAddresses?.lendingPool]
  );
  const {
    approvalMutation: { mutateAsync },
  } = useApprovalMutation(approvalArgs);
  const onSubmit = React.useCallback(() => {
    mutateAsync()
      .then(() => dispatch(createState("repayTx", { ...state })))
      // TODO: Switch to an error-display state that returns to init
      .catch(e => dispatch(createState("init", state)));
  }, [state, dispatch, mutateAsync]);
  const currentStep: PossibleTags<RepayState> = "amountSelected";
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
      title={RepayTitle}
      amount={state.amountToRepay}
      asset={state.token}
      collateral={false}
      increase={false}
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

const RepayTxComp: React.FC<{
  state: AmountSelectedState;
  dispatch: (nextState: RepayState) => void;
}> = ({ state, dispatch }) => {
  const repayArgs = React.useMemo<UseRepayMutationProps>(
    () => ({
      asset: state.token.tokenAddress,
      amount: state.amountToRepay,
      borrowMode: state.borrowMode,
    }),
    [state]
  );
  const {
    repayMutation: { mutateAsync },
  } = useRepayMutation(repayArgs);
  const onSubmit = React.useCallback(() => {
    mutateAsync()
      .then(() => dispatch(createState("repaidTx", { ...state })))
      // TODO: Switch to an error-display state that returns to init
      .catch(e => dispatch(createState("init", state)));
  }, [state, dispatch, mutateAsync]);
  const currentStep: PossibleTags<RepayState> = "repayTx";
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
      title={RepayTitle}
      amount={state.amountToRepay}
      asset={state.token}
      collateral={false}
      increase={false}
    >
      {stepperBar}
      <ControllerItem
        stepNumber={2}
        stepName="Repay"
        stepDesc="Please submit to repay"
        actionName="Repay"
        onActionClick={onSubmit}
        totalSteps={visibleStateNames.length}
      />
    </WizardOverviewWrapper>
  );
};

const RepaidTxComp: React.FC<{
  state: RepaidTXState;
  dispatch: (nextState: RepayState) => void;
}> = ({ state }) => {
  const history = useHistory();
  const currentStep: PossibleTags<RepayState> = "repaidTx";
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
      title={RepayTitle}
      amount={state.amountToRepay}
      asset={state.token}
      collateral={false}
      increase={false}
    >
      {stepperBar}
      <ControllerItem
        stepNumber={3}
        stepName="Success"
        actionName="Dashboard"
        onActionClick={() => history.push("/dashboard")}
        totalSteps={visibleStateNames.length}
      />
    </WizardOverviewWrapper>
  );
};

const RepayStateMachine: React.FC<{
  state: RepayState;
  setState: (newState: RepayState) => void;
}> = ({ state, setState }) => {
  switch (state.type) {
    case "init":
      return <InitialComp state={state.init} dispatch={setState} />;
    case "amountSelected":
      return (
        <AmountSelectedComp state={state.amountSelected} dispatch={setState} />
      );
    case "repayTx":
      return <RepayTxComp state={state.repayTx} dispatch={setState} />;
    case "repaidTx":
      return <RepaidTxComp state={state.repaidTx} dispatch={setState} />;
  }
};

const RepayDetailForAsset: React.FC<{
  asset: ReserveOrNativeTokenDefinition;
  borrowMode: number;
}> = ({ asset, borrowMode }) => {
  const dash = React.useMemo(
    () => <RepayDash token={asset} borrowMode={borrowMode} />,
    [asset]
  );

  const [repayState, setRepayState] = React.useState<RepayState>(
    createState("init", { token: asset, borrowMode: borrowMode })
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
        <RepayStateMachine state={repayState} setState={setRepayState} />
      </Center>
    </VStack>
  );
};

export const RepayDetail: React.FC = () => {
  const match =
    useRouteMatch<{
      assetName: string | undefined;
      borrowMode: string | undefined;
    }>();
  const history = useHistory();
  const assetName = match.params.assetName;
  const borrowMode = match.params.borrowMode === "variable" ? 2 : 1;
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

  return <RepayDetailForAsset asset={asset} borrowMode={borrowMode} />;
};
