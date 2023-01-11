import React, { useMemo,ReactNode, useEffect } from "react";
import { Box, Center, Text, VStack, Button, Modal, ModalOverlay, ModalContent, ModalFooter, Spinner, Input, InputProps, StackDivider } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import { fontSizes, spacings } from "../../utils/constants";
import { BigNumber, FixedNumber } from "ethers";
import { useHistory, useRouteMatch } from "react-router-dom";
import ColoredText from "../../components/ColoredText";
import { OneTaggedPropertyOf, PossibleTags } from "../../utils/types";
import { useUserAssetBalance } from "../../queries/userAssets";
import { bigNumberToString } from "../../utils/fixedPoint";
import { DepositDash } from "../Deposit/DepositDash";
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
import {
    ReserveOrNativeTokenDefinition,
    isReserveTokenDefinition,
    useTokenDefinitionBySymbol,
    NATIVE_TOKEN,
  } from "../../queries/allReserveTokens";
import { StepperBar, WizardOverviewWrapper } from "../common/Wizard";
import { MINIMUM_NATIVE_RESERVE } from "../../utils/constants";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";
import { DashOverviewIntro } from "../common/DashOverview";
import { internalAddressesPerNetwork } from "../../utils/contracts/contractAddresses/internalAddresses";


interface InitialState {
    token: Readonly<ReserveOrNativeTokenDefinition>;
}

interface AmountSelectedState extends InitialState {
    amountToWrap: BigNumber;
}

interface WrapTXState extends AmountSelectedState {

}

interface WrappedTXState extends WrapTXState {

}

type WrapState = OneTaggedPropertyOf<{
    init: InitialState;
    amountSelected: AmountSelectedState;
    wrapTx: WrapTXState;
    wrappedTx: WrappedTXState;
}>;

function createState<SelectedState extends PossibleTags<WrapState>>(
    type: SelectedState,
    value: WrapState[SelectedState]
): WrapState {
    return {
        type,
        [type]: value,
    } as any;
}
  
const stateNames: Record<PossibleTags<WrapState>, string> = {
    init: "Token",
    amountSelected: "Approval",
    wrapTx: "Wrap",
    wrappedTx: "Wrapped",
};

const visibleStateNames: ReadonlyArray<PossibleTags<WrapState>> = [
    "amountSelected",
    "wrapTx",
    "wrappedTx",
] as const;

const WrapTitle = "Wrap overview";

const InitialComp: React.FC<{
    state: InitialState;
    dispatch: (nextState: WrapState) => void;
}> = ({ state, dispatch }) => {
    const [amount, setAmount] = React.useState<BigNumber>();
    const { data: userBalance } = useUserAssetBalance(state.token);
  
    const usefulBalance =
      userBalance && state.token.tokenAddress === NATIVE_TOKEN
        ? userBalance.sub(MINIMUM_NATIVE_RESERVE)
        : userBalance;
  
    const onSubmit = React.useCallback(
      amountToWrap =>
        dispatch(createState("amountSelected", { amountToWrap, ...state })),
      [state, dispatch]
    );
    return (
      <DashOverviewIntro
        asset={state.token}
        amount={amount}
        setAmount={setAmount}
        mode="deposit"
        onSubmit={onSubmit}
        balance={usefulBalance}
      />
    );
};

const AmountSelectedComp: React.FC<{
    state: AmountSelectedState;
    dispatch: (nextState: WrapState) => void;
  }> = ({ state, dispatch }) => {
    const chainAddresses = useChainAddresses();
    const approvalArgs = React.useMemo<UseApprovalMutationProps>(
      () => ({
        asset: isReserveTokenDefinition(state.token)
          ? state.token.tokenAddress
          : undefined,
        amount: state.amountToWrap,
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
        .then(() => dispatch(createState("wrapTx", { ...state })))
        .catch(e => dispatch(createState("init", state)));
    }, [state, dispatch, mutateAsync]);
    const currentStep: PossibleTags<WrapState> = "amountSelected";
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
        title={WrapTitle}
        amount={state.amountToWrap}
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


const WrapTxComp: React.FC<{
    state: WrapTXState;
    dispatch: (nextState: WrapState) => void;
  }> = ({ state, dispatch }) => {
    const chainAddresses = useChainAddresses();
    const wrapArgs = React.useMemo<UseDepositMutationProps>(
      () => ({
        asset: state.token.tokenAddress,
        amount: state.amountToWrap,
        spender: isReserveTokenDefinition(state.token)
          ? chainAddresses?.lendingPool
          : chainAddresses?.wrappedNativeGateway,
      }),
      [state, chainAddresses?.lendingPool, chainAddresses?.wrappedNativeGateway]
    );
    const {
      depositMutation: { mutateAsync },
    } = useDepositMutation(wrapArgs);
    const onSubmit = React.useCallback(() => {
      mutateAsync()
        .then(() => dispatch(createState("wrappedTx", { ...state })))
        .catch(e => dispatch(createState("init", state)));
    }, [state, dispatch, mutateAsync]);
    const currentStep: PossibleTags<WrapState> = "wrapTx";
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
        title={WrapTitle}
        amount={state.amountToWrap}
        asset={state.token}
        collateral={true}
        increase={true}
      >
        {stepperBar}
        <ControllerItem
          stepNumber={2}
          stepName="Wrap"
          stepDesc="Please submit to wrap your tokens"
          actionName="Deposit"
          onActionClick={onSubmit}
          totalSteps={visibleStateNames.length}
        />
      </WizardOverviewWrapper>
    );
};

const WrappedTxComp: React.FC<{
    state: WrappedTXState;
    dispatch: (nextState: WrapState) => void;
  }> = ({ state, dispatch }) => {
    const history = useHistory();
    const currentStep: PossibleTags<WrapState> = "wrappedTx";
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
        title={WrapTitle}
        amount={state.amountToWrap}
        asset={state.token}
        collateral={true}
        increase={true}
      >
        {stepperBar}
        <ControllerItem
          stepNumber={3}
          stepName="Wrapped"
          stepDesc={`Wrap of ${bigNumberToString(
            state.amountToWrap,
            4,
            decimals
          )} ${state.token.symbol} successful`}
          actionName="Finish"
          onActionClick={() => history.push("/wrap")}
          totalSteps={visibleStateNames.length}
        />
      </WizardOverviewWrapper>
    );
};
  
export const WrapStateMachine: React.FC<{
    state: WrapState;
    setState: (newState: WrapState) => void;
  }> = ({ state, setState }) => {
    switch (state.type) {
      case "init":
        return <InitialComp state={state.init} dispatch={setState} />;
      case "amountSelected":
        return (
          <AmountSelectedComp state={state.amountSelected} dispatch={setState} />
        );
      case "wrapTx":
        return <WrapTxComp state={state.wrapTx} dispatch={setState} />;
      case "wrappedTx":
        return <WrappedTxComp state={state.wrappedTx} dispatch={setState} />;
    }
};

const DepositDetailForAsset: React.FC<{
    asset: ReserveOrNativeTokenDefinition;
  }> = ({ asset }) => {
    const dash = React.useMemo(() => <DepositDash token={asset} />, [asset]);
    const [wrapState, setWrapState] = React.useState<WrapState>(() =>
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
          <WrapStateMachine state={wrapState} setState={setWrapState} />
        </Center>
      </VStack>
    );
};


export const Wrapping: React.FC<{
  type: "wrap" | "unwrap";
  token: string;
  target: string;
  amount: BigNumber | undefined;
  decimals: BigNumber;
}> = ({
  type,
  token,
  target,
  amount,
  decimals
}) => {

  return (
    <VStack
      spacing={4}
      w="90%"
      align="center"
      flexDirection="column"
    >
      <ColoredText
        fontSize="1.8rem"
      >
        {type=="wrap"?"Wrap tokens":"Unwrap tokens"}
      </ColoredText>
      <Box
            rounded="5px"
            //bg="secondary.900"
            //border="2px solid var(--chakra-colors-secondary-900)"
            padding="3px 10px"
            fontSize="1.4rem"      
      >
        <HStack fontWeight="bold">
          <Box
            rounded="5px"
            bg="secondary.100"
            border="2px solid var(--chakra-colors-secondary-900)"
            padding="3px 10px"
            fontSize="1.4rem"
          >{token}</Box>
          <Box color="secondary.900" fontWeight="bold"> ⇒ </Box>
          <Box
            rounded="5px"
            bg="secondary.100"
            border="2px solid var(--chakra-colors-secondary-900)"
            padding="3px 10px"
            fontSize="1.4rem"
          >{target}</Box>
        </HStack>
        <Box
          fontWeight="bold"
          fontSize="1.8rem"
          mt="10px"
        >
          {FixedNumber.fromValue(BigNumber.from(amount), decimals).toString()}
        </Box>
      </Box>
      <StackDivider
          h="0.188rem"
          backgroundColor="secondary.900"
      />

    </VStack>
  )

}

/*
export const DepositDetail: React.FC = () => {
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
        </Box>
      );
    }
    return <DepositDetailForAsset asset={asset} />;
  };
*/