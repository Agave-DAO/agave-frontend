import React from "react";
import { VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useHistory, useRouteMatch, withRouter } from "react-router-dom";
import DepositDash from "../common/DepositDash";
import DashOverview, { DashOverviewIntro } from "../common/DashOverview";
import {
  ReserveTokenDefinition,
  useAllReserveTokens,
} from "../../queries/allReserveTokens";
import { Box, Center, HStack, Text } from "@chakra-ui/react";
import ColoredText from "../../components/ColoredText";
import { BigNumber } from "ethers";
import { OneTaggedPropertyOf, PossibleTags } from "../../utils/types";
import { useUserAssetBalance } from "../../queries/userAssets";
// import { TransactionLog } from "../common/TransactionLog";
import { ModalIcon, TokenIcon } from "../../utils/icons";
import { fontSizes, LINEAR_GRADIENT_BG } from "../../utils/constants";
import { formatEther } from "ethers/lib/utils";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { useUserAccountData } from "../../queries/userAccountData";
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

interface InitialState {
  token: Readonly<ReserveTokenDefinition>;
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

const visibleStateNames = ["amountSelected", "depositTx", "depositedTx"];

const DepositOverviewWrapper: React.FC<{
  asset: ReserveTokenDefinition;
  amount: BigNumber;
}> = ({ asset, amount, children }) => {
  const { account: userAccountAddress } = useAppWeb3();
  const { data: userAccountData } = useUserAccountData(
    userAccountAddress ?? undefined
  );
  const currentHealthFactor = userAccountData?.healthFactor;
  return (
    <VStack w="50%" spacing="0">
      <ColoredText textTransform="capitalize" fontSize="1.8rem">
        Deposit overview
      </ColoredText>
      <Box h="1.3rem" />
      <Text fontSize={fontSizes.md}>
        These are your transaction details. Please verify them before
        submitting.
      </Text>
      <Box h={fontSizes.xl} />
      <VStack
        spacing=".5rem"
        p="1.5rem"
        w="30rem"
        background="secondary.900"
        rounded="lg"
        alignItems="space-between"
      >
        <HStack justifyContent="space-between">
          <Text lineHeight={fontSizes.md} fontSize="1rem">
            Amount
          </Text>
          <HStack>
            <TokenIcon
              symbol={asset.symbol}
              boxSize={{ base: "1.5rem", md: "1.8rem" }}
            />
            <Text fontSize="1.2rem">
              {formatEther(amount)} {asset.symbol}
            </Text>
          </HStack>
        </HStack>
        <HStack justifyContent="space-between">
          <HStack spacing=".2rem">
            <Text lineHeight={fontSizes.md} fontSize="1rem">
              Current health factor
            </Text>
            <ModalIcon
              onOpen={() => {}}
              position="relative"
              top="0"
              right="0"
              margin="0"
              transform="scale(0.75)"
            />
          </HStack>
          <ColoredText
            fontSize="1.2rem"
            overflow="hidden"
            overflowWrap="normal"
          >
            {currentHealthFactor
              ?.toUnsafeFloat()
              .toLocaleString(undefined, { notation: "scientific" }) ?? "-"}
          </ColoredText>
        </HStack>
        {/* Calculating this is hard - do it later */}
        {/* <HStack justifyContent="space-between">
          <Text lineHeight={fontSizes.md} fontSize="1rem">
            Next health factor
          </Text>
          <ColoredText fontSize="1.2rem">(Unimplemented)</ColoredText>
        </HStack> */}
      </VStack>
      <Box h={fontSizes.md} />
      <VStack
        w="30rem"
        minH="8rem"
        bg="secondary.900"
        rounded="lg"
        overflow="hidden"
      >
        {/* {mode === "withdraw" ? (
          <WithdrawController
            onStepComplete={handleStepComplete}
            onStepInitiate={handleStepInitiate}
            currentStep={step}
          />
        ) : (
          <DepositController
            onStepComplete={handleStepComplete}
            onStepInitiate={handleStepInitiate}
            currentStep={step}
          />
        )}
        {stepLogsArr.reverse().map(log => {
          return <TransactionLog log={log} />;
        })} */}
        {children}
      </VStack>
    </VStack>
  );
};

const StepperBar: React.FC<{
  states: ReadonlyArray<string>;
  stateNames: Readonly<Record<string, string>>;
  currentState: string;
}> = ({ states, currentState, stateNames }) => {
  return (
    <HStack w="100%" spacing="0">
      {states.map((step, index) => (
        <Center
          key={step}
          flex={1}
          background={
            step === currentState ? LINEAR_GRADIENT_BG : "primary.300"
          }
          color="secondary.900"
          fontSize="1rem"
          padding=".3rem"
        >
          {index + 1} {stateNames[step]}
        </Center>
      ))}
    </HStack>
  );
};

const InitialComp: React.FC<{
  state: InitialState;
  dispatch: (nextState: DepositState) => void;
}> = ({ state, dispatch }) => {
  const [amount, setAmount] = React.useState<BigNumber>();
  const { data: userBalance } = useUserAssetBalance(state.token.tokenAddress);
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
      asset: state.token.tokenAddress,
      amount: state.amountToDeposit,
      spender: chainAddresses?.lendingPool,
    }),
    [state, chainAddresses?.lendingPool]
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
    <DepositOverviewWrapper amount={state.amountToDeposit} asset={state.token}>
      {stepperBar}
      <ControllerItem
        stepNumber={1}
        stepName="Approval"
        stepDesc="Please submit to approve"
        actionName="Approve"
        onActionClick={onSubmit}
        totalSteps={visibleStateNames.length}
      />
    </DepositOverviewWrapper>
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
      spender: chainAddresses?.lendingPool,
    }),
    [state, chainAddresses?.lendingPool]
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
    <DepositOverviewWrapper amount={state.amountToDeposit} asset={state.token}>
      {stepperBar}
      <ControllerItem
        stepNumber={1}
        stepName="Deposit"
        stepDesc="Please submit to deposit"
        actionName="Deposit"
        onActionClick={onSubmit}
        totalSteps={visibleStateNames.length}
      />
    </DepositOverviewWrapper>
  );
};

const DepositedTxComp: React.FC<{
  state: DepositedTXState;
  dispatch: (nextState: DepositState) => void;
}> = ({ state, dispatch }) => {
  return (
    <>
      Congrats, you deposited {formatEther(state.amountToDeposit)}{" "}
      {state.token.symbol}!
    </>
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

const DepositDetailForAsset: React.FC<{ asset: ReserveTokenDefinition }> = ({
  asset,
}) => {
  const dash = React.useMemo(
    () => (asset ? <DepositDash token={asset} /> : undefined),
    [asset]
  );
  const [depositState, setDepositState] = React.useState<DepositState>(
    createState("init", { token: asset })
  );

  return (
    <VStack color="white" spacing="3.5rem" mt="3.5rem" minH="65vh">
      {dash}
      <>State: {depositState.type}</>
      <Center
        w="100%"
        color="primary.100"
        bg="primary.900"
        rounded="lg"
        padding="1em"
      >
        <DepositStateMachine state={depositState} setState={setDepositState} />
      </Center>
      <DashOverview mode="deposit" />
    </VStack>
  );
};

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
  return <DepositDetailForAsset asset={asset} />;
};

export default withRouter(DepositDetail);
