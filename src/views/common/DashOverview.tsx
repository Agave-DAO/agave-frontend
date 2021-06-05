import { Box, Center, HStack, Text, VStack } from "@chakra-ui/layout";
import React, { useEffect, useMemo, useState } from "react";
import ColoredText from "../../components/ColoredText";
import InfoWeiBox from "./InfoWeiBox";
import { BigNumber } from "ethers";
import { Button } from "@chakra-ui/button";
import { ModalIcon } from "../../utils/icons";

import { fontSizes, LINEAR_GRADIENT_BG } from "../../utils/constants";
import { TxData } from "../../utils/types";
import { WithdrawController } from "../Withdraw/WithdrawController";
import { DepositController } from "../Deposit/DepositController";
import { TokenIcon } from "../../utils/icons";
import { TransactionLog } from "./TransactionLog";

import daiLogo from "../../assets/image/coins/dai.svg";

const getStepData = () =>
  JSON.parse(sessionStorage.getItem("currentStep") || "{}");

/** INTRO SECTION */
const DashOverviewIntro: React.FC<{
  mode: string;
  onSubmit: (value: BigNumber) => void;
  amount: BigNumber | undefined;
  setAmount: React.Dispatch<React.SetStateAction<BigNumber | undefined>>;
}> = ({ mode, onSubmit, amount, setAmount }) => {
  return (
    <VStack w="50%" spacing="0">
      <ColoredText fontSize="1.8rem" textTransform="capitalize">
        {mode}
      </ColoredText>
      <Text fontSize={fontSizes.md}>How much do you want to {mode}?</Text>
      <Box h="3.3rem" />
      <InfoWeiBox
        w="100%"
        currency="xDAI"
        icon={daiLogo}
        amount={amount}
        setAmount={setAmount}
        mode={mode}
        balance={BigNumber.from(0)}
      />
      <Box h="4.3rem" />
      <Button
        disabled={!amount?.gt(0)}
        bg={LINEAR_GRADIENT_BG}
        _hover={{
          background: LINEAR_GRADIENT_BG,
        }}
        color="secondary.900"
        fontSize={fontSizes.md}
        px="7.5rem"
        py=".8rem"
        onClick={() => onSubmit(amount || BigNumber.from(0))}
      >
        Continue
      </Button>
    </VStack>
  );
};

/** STEPPER MASTER SWITCH */
const DashOverviewStepper: React.FC<{
  amount: BigNumber;
  currentHealthFactor: number;
  nextHealthFactor: number;
  mode: string;
  onModalOpen: () => void;
}> = ({ mode, onModalOpen }) => {
  const [step, changeStep] = useState(() =>
    parseInt(
      JSON.parse(sessionStorage.getItem("currentStep") || "1")?.[mode] || "1"
    )
  );
  const [stepLogs, setStepLogs] = useState<Record<string, TxData>>(() =>
    JSON.parse(sessionStorage.getItem("stepLogs") || "{}")
  );

  const stepLogsArr = useMemo(() => Object.values(stepLogs), [stepLogs]);

  const handleStepComplete = (txHash: string, stepName: string) => {
    setStepLogs(prevLogs => ({
      ...prevLogs,
      [txHash]: {
        txHash,
        stepName,
        completedAt: new Date(),
        isComplete: true,
      },
    }));

    changeStep(prevStep => prevStep + 1);
    const stepData = getStepData();
    sessionStorage.setItem(
      "currentStep",
      JSON.stringify({ ...stepData, [mode]: step + 1 })
    );
  };

  const handleStepInitiate = (txData: TxData) =>
    setStepLogs(prevLogs => ({ ...prevLogs, [txData.txHash]: { ...txData } }));

  useEffect(() => {
    sessionStorage.setItem("stepLogs", JSON.stringify(stepLogs));
  }, [stepLogs]);

  useEffect(() => {
    if (
      (mode === "deposit" && step === 2) ||
      (mode === "withdraw" && step === 3)
    ) {
      sessionStorage.removeItem("stepLogs");
      const stepData = getStepData();
      delete stepData[mode];
      sessionStorage.setItem("currentStep", JSON.stringify(stepData));
    }
  }, [mode, step]);

  useEffect(() => {
    step === 1 &&
      sessionStorage.setItem(
        "currentStep",
        JSON.stringify({ ...getStepData(), [mode]: 1 })
      );
  }, [step, mode]);

  return (
    <VStack w="50%" spacing="0">
      <ColoredText textTransform="capitalize" fontSize="1.8rem">
        {mode} overview
      </ColoredText>
      <Box h="1.3rem" />
      <Text fontSize={fontSizes.md}>
        These are your transaction details. Make sure to check if this is
        correct before submitting.
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
              symbol="DAI"
              boxSize={{ base: "1.5rem", md: "1.8rem" }}
            />
            <Text fontSize="1.2rem">220 xDAI</Text>
          </HStack>
        </HStack>
        <HStack justifyContent="space-between">
          <HStack spacing=".2rem">
            <Text lineHeight={fontSizes.md} fontSize="1rem">
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
          <Text lineHeight={fontSizes.md} fontSize="1rem">
            Next health factor
          </Text>
          <ColoredText fontSize="1.2rem">5.11</ColoredText>
        </HStack>
      </VStack>
      <Box h={fontSizes.md} />
      <VStack
        w="30rem"
        minH="8rem"
        bg="secondary.900"
        rounded="lg"
        overflow="hidden"
      >
        {mode === "withdraw" ? (
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
        })}
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

  useEffect(() => {
    if (getStepData()[mode] > 1) setToggleExecution(true);
  }, [mode]);

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
