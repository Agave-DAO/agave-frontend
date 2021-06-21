import React from "react";
import { Center, VStack, Text, Button } from "@chakra-ui/react";
import { LINEAR_GRADIENT_BG, spacings } from "../../utils/constants";

export const ControllerItem: React.FC<{
  stepName: string;
  actionName?: string | undefined;
  stepDesc: string | null;
  stepNumber: number;
  onActionClick: () => void;
  totalSteps: number;
}> = ({ stepDesc, stepName, actionName, onActionClick, totalSteps, stepNumber }) => {
  return (
    <Center w="100%" justifyContent="space-between" p="1.2rem">
      <VStack spacing="0" alignItems="flex-start">
        <Text fontSize={spacings.md} color="yellow.100">
          {stepNumber}/{totalSteps} {stepName}
        </Text>
        {stepDesc && <Text fontSize="1rem">{stepDesc}</Text>}
      </VStack>
      <Button
        bg={LINEAR_GRADIENT_BG}
        fontSize="1.2rem"
        textTransform="capitalize"
        color="secondary.900"
        fontWeight="light"
        _hover={{ background: LINEAR_GRADIENT_BG }}
        onClick={onActionClick}
      >
        {actionName ?? stepName}
      </Button>
    </Center>
  );
};
