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
} from "../../mutations/depositByWrap";
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
    token: any;
}

interface AmountSelectedState extends InitialState {
  token: any;
  amountToWrap: BigNumber;
}

interface WrapTXState extends AmountSelectedState {}

interface WrappedTXState extends WrapTXState {
}

interface NativeTokenDefinition {
  symbol: string;
  tokenAddress: NATIVE_TOKEN;
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
    amountSelected: "Approve",
    wrapTx: "Wrap",
    wrappedTx: "Finish",
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
        .catch(e => console.log("Error"));
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

      <>
        {stepperBar}
        <Button 
          width="30%"
          mt="20px !important"
          textTransform="uppercase"
          background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          color="secondary.900"
          fontWeight="bold"
          px={{ base: "10rem", md: "6rem" }}
          py="1.5rem"
          fontSize={fontSizes.md}
          onClick={()=>onSubmit()}
          bg="secondary.900"
        >
          Approve
        </Button>
      </>

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
    const history = useHistory();
    const {
      depositMutation: { mutateAsync },
    } = useDepositMutation(wrapArgs);
    const onSubmit = React.useCallback(() => {
      mutateAsync()
        .then(() => dispatch(createState("wrappedTx", { ...state })))
        .catch(e => console.log(e));
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
      <>
        {stepperBar}
        <Button 
          width="30%"
          mt="20px !important"
          textTransform="uppercase"
          background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          color="secondary.900"
          fontWeight="bold"
          px={{ base: "10rem", md: "6rem" }}
          py="1.5rem"
          fontSize={fontSizes.md}
          onClick={()=>onSubmit()}
          bg="secondary.900"
        >
          Wrap tokens
        </Button>
      </>
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
      <>
        {stepperBar}
        <Button 
          width="30%"
          mt="20px !important"
          textTransform="uppercase"
          background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          color="secondary.900"
          fontWeight="bold"
          px={{ base: "10rem", md: "6rem" }}
          py="1.5rem"
          fontSize={fontSizes.md}
          onClick={()=>history.push("/wrap")}
          bg="secondary.900"
        >
          Finish
        </Button>
      </>
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
  sourceToken: string;
  targetToken: string;
  amount: BigNumber | undefined;
  decimals: BigNumber;
}> = ({
  type,
  sourceToken,
  targetToken,
  amount,
  decimals
}) => {


  const asset = {symbol: 'agWXDAI', tokenAddress: internalAddressesPerNetwork.Gnosis.agWXDAI};
  
  const [wrapState, setWrapState] = React.useState<WrapState>(() =>
    createState("amountSelected", { amountToWrap: BigNumber.from(amount), token:asset })
  );

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
          >{sourceToken}</Box>
          <Box color="secondary.900" fontWeight="bold"> ⇒ </Box>
          <Box
            rounded="5px"
            bg="secondary.100"
            border="2px solid var(--chakra-colors-secondary-900)"
            padding="3px 10px"
            fontSize="1.4rem"
          >{targetToken}</Box>
        </HStack>
        <Box
          fontWeight="bold"
          fontSize="1.8rem"
          mt="10px"
        >
          {FixedNumber.fromValue(BigNumber.from(amount), decimals).toString()}
        </Box>
      </Box>


      <WrapStateMachine state={wrapState} setState={setWrapState} />

    </VStack>
  )

}

