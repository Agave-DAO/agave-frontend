import React, { useCallback, useMemo } from "react";
import { HStack, Center } from "@chakra-ui/react";
import { ControllerItem } from "../../components/ControllerItem";
import { LINEAR_GRADIENT_BG } from "../../utils/constants";
import { TxData } from "../../utils/types";
import { sleep } from "../../utils/helpers";

const fakeApprove = async () =>
  "0x41d7990d940f8fb6198b2a7b33940bd0526ed17b8695e7e09f9e1a3d21c0adb1";
const fakeWithdraw = async () =>
  "0x41d7990d940f8fb6198b2a7b33940bd0526ed17b8695e7e09f9e1a3d21c0adc1";

const WITHDRAW_STEPS = [
  { name: "Approve" },
  { name: "Withdraw" },
  { name: "Finished" },
];

export const WithdrawController: React.FC<{
  onStepInitiate: (txData: TxData) => void;
  onStepComplete: (txHash: string, stepName: string) => void;
  currentStep: number;
}> = ({ currentStep, onStepComplete, onStepInitiate }) => {
  const processTransaction = useCallback(
    async (txHash: string, stepName: string) => {
      const tx: TxData = {
        txHash,
        completedAt: null,
        isComplete: false,
        stepName,
      };
      onStepInitiate(tx);
      await sleep(2000);
      onStepComplete(txHash, stepName);
    },
    [onStepComplete, onStepInitiate]
  );

  // FAKE HANDLERS
  const handleApprove = useCallback(async () => {
    const txHash = await fakeApprove();
    await processTransaction(txHash, "Approve");
  }, [processTransaction]);

  const handleWithdraw = useCallback(async () => {
    const txHash = await fakeWithdraw();
    await processTransaction(txHash, "Withdraw");
  }, [processTransaction]);

  const currentStepElement = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          <ControllerItem
            stepNumber={1}
            stepName="Approve"
            stepDesc="Please approve before withdrawal"
            onActionClick={handleApprove}
            totalSteps={3}
          />
        );
      case 2:
        return (
          <ControllerItem
            stepNumber={2}
            stepName="Withdraw"
            stepDesc="Please submit to withdraw"
            onActionClick={handleWithdraw}
            totalSteps={3}
          />
        );
      case 3:
        return (
          <ControllerItem
            stepNumber={3}
            stepName="Success"
            stepDesc={null}
            onActionClick={() => window.location.replace("/#/stake")}
            totalSteps={3}
          />
        );
      default:
        return null;
    }
  }, [currentStep, handleApprove, handleWithdraw]);

  return (
    <>
      <HStack w="100%" spacing="0">
        {WITHDRAW_STEPS.map((step, index) => (
          <Center
            key={index + 1}
            flex={1}
            background={
              index + 1 === currentStep ? LINEAR_GRADIENT_BG : "primary.300"
            }
            color="secondary.900"
            fontSize="1rem"
            padding=".3rem"
          >
            {index + 1} {step.name}
          </Center>
        ))}
      </HStack>
      {currentStepElement}
      {}
    </>
  );
};
