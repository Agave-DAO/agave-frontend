import { Center, HStack, Text, VStack } from "@chakra-ui/layout";
import { useMemo, useState } from "react";
import ColoredText from "../../components/ColoredText";
import daiLogo from "../../assets/image/coins/dai.svg";
import InfoWeiBox from "./InfoWeiBox";
import { BigNumber } from "ethers";
import { Button } from "@chakra-ui/button";
import ModalIcon from "../../components/ModalIcon";
import { Image } from "@chakra-ui/image";

type TxData = {
  txHash: string;
  completedAt: Date;
  stepNumber: number;
  isComplete: boolean;
};

const LINEAR_GRADIENT_BG =
  "linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%)";

/** INTRO SECTION */
const DashOverviewIntro: React.FC<{
  mode: string;
  onSubmit: (value: BigNumber) => void;
  amount: BigNumber | undefined;
  setAmount: React.Dispatch<React.SetStateAction<BigNumber | undefined>>;
}> = ({ mode, onSubmit, amount, setAmount }) => {
  return (
    <VStack w="50%">
      <ColoredText fontSize="1.8rem" textTransform="capitalize">
        {mode}
      </ColoredText>
      <Text fontSize="1.4rem">How much do you want to {mode}?</Text>
      <InfoWeiBox
        w="100%"
        mt="3.3rem !important"
        currency="xDAI"
        icon={daiLogo}
        amount={amount}
        setAmount={setAmount}
        mode={mode}
        balance={BigNumber.from(0)}
      />
      <Button
        mt="4.3rem !important"
        disabled={!amount?.gt(0)}
        bg={LINEAR_GRADIENT_BG}
        _hover={{
          background: LINEAR_GRADIENT_BG,
        }}
        color="secondary.900"
        fontSize="1.4rem"
        px="7.5rem"
        py=".8rem"
        onClick={() => onSubmit(amount || BigNumber.from(0))}
      >
        Continue
      </Button>
    </VStack>
  );
};

/** STEPPER CONTROLLERS */
const WithdrawController: React.FC<{
  onStepInitiate: (txData: TxData) => void;
  onStepComplete: (txHash: string) => void;
}> = () => {
  return <h1>Withdraw Controller</h1>;
};

const DepositController: React.FC<{
  onStepInitiate: (txData: TxData) => void;
  onStepComplete: (txHash: string) => void;
}> = () => {
  return <h1>Deposit Controller</h1>;
};

/** STEPPER MASTER SWITCH */
const DashOverviewStepper: React.FC<{
  amount: BigNumber;
  currentHealthFactor: number;
  nextHealthFactor: number;
  mode: string;
  onModalOpen: () => void;
}> = ({ mode, onModalOpen }) => {
  const [step, changeStep] = useState(1);
  const [stepLogs, setStepLogs] = useState<Record<string, TxData>>({});

  const handleStepComplete = (txHash: string) => {};
  const handleStepInitiate = (txData: TxData) => {};

  return (
    <VStack w="50%" spacing="0">
      <ColoredText
        textTransform="capitalize"
        fontSize="1.8rem"
        mb="1.3rem !important"
      >
        {mode} overview
      </ColoredText>
      <Text fontSize="1.4rem">
        These are your transaction details. Make sure to check if this is
        correct before submitting.
      </Text>
      <VStack
        mt="1.7rem !important"
        spacing=".5rem"
        p="1.5rem"
        w="30rem"
        background="secondary.900"
        rounded="lg"
        alignItems="space-between"
      >
        <HStack justifyContent="space-between">
          <Text lineHeight="1.4rem" fontSize="1rem">
            Amount
          </Text>
          <HStack>
            <Image
              src={daiLogo}
              boxSize={{ base: "1.5rem", md: "1.8rem" }}
              alt="Image left element for WeiBox"
            />
            <Text fontSize="1.2rem">220 xDAI</Text>
          </HStack>
        </HStack>
        <HStack justifyContent="space-between">
          <HStack spacing=".2rem">
            <Text lineHeight="1.4rem" fontSize="1rem">
              Current health factor
            </Text>
            <ModalIcon
              onOpen={onModalOpen}
              position="relative"
              top="0"
              right="0"
              margin="0"
              transform="scale(0.75)"
            />
          </HStack>
          <ColoredText fontSize="1.2rem">5.67</ColoredText>
        </HStack>
        <HStack justifyContent="space-between">
          <Text lineHeight="1.4rem" fontSize="1rem">
            Next health factor
          </Text>
          <ColoredText fontSize="1.2rem">5.11</ColoredText>
        </HStack>
      </VStack>
      <VStack
        w="30rem"
        minH="8rem"
        bg="secondary.900"
        mt="1.4rem !important"
        rounded="lg"
      >
        {mode === "withdraw" ? (
          <WithdrawController
            onStepComplete={handleStepComplete}
            onStepInitiate={handleStepInitiate}
          />
        ) : (
          <DepositController
            onStepComplete={handleStepComplete}
            onStepInitiate={handleStepInitiate}
          />
        )}
      </VStack>
    </VStack>
  );
};

/** BINDING COMPONENT */
const DashOverview: React.FC<{ mode: string }> = ({ mode }) => {
  const [toggleExecution, setToggleExecution] = useState(false);
  const [amount, setAmount] = useState<BigNumber | undefined>(
    BigNumber.from(0)
  );

  const handleSubmit = (value: BigNumber) => {
    // This log can be deleted later :)
    console.log(value, value.toString());
    setToggleExecution(true);
  };

  return (
    <Center
      p="3rem"
      flex={1}
      background="primary.900"
      w="100%"
      rounded="lg"
      position="relative"
    >
      <Button
        background="transparent"
        border="1px solid white"
        fontWeight="light"
        fontSize="1.2rem"
        px="1.8rem"
        py=".5rem"
        position="absolute"
        top="3rem"
        left="3rem"
        onClick={() => setToggleExecution(false)}
      >
        Back
      </Button>
      {!toggleExecution ? (
        <DashOverviewIntro
          mode={mode}
          onSubmit={handleSubmit}
          amount={amount}
          setAmount={setAmount}
        />
      ) : (
        amount && (
          <DashOverviewStepper
            amount={amount}
            currentHealthFactor={5.67}
            nextHealthFactor={5.11}
            mode={mode}
            onModalOpen={() => {}}
          />
        )
      )}
    </Center>
  );
};

export default DashOverview;
