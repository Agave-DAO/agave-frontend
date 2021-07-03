import React from "react";
import { VStack, Flex, Text, StackProps } from "@chakra-ui/react";
import { BigNumber, FixedNumber } from "ethers";
import { WeiBox } from "../../components/Actions/WeiBox";
import { fontSizes } from "../../utils/constants";
import { TokenIcon } from "../../utils/icons";

const InfoWeiBox: React.FC<
  {
    currency: string;
    mode: string;
    balance: BigNumber | undefined;
    amount: BigNumber | undefined;
    setAmount: React.Dispatch<React.SetStateAction<BigNumber | undefined>>;
  } & StackProps
> = ({ mode, balance, currency, amount, setAmount, ...props }) => {
  return (
    <VStack fontSize="1.5rem" {...props}>
      <Flex
        w="100%"
        justifyContent="space-between"
        fontSize={{ base: fontSizes.md, md: "inherit" }}
      >
        <Text color="white" fontSize="inherit">
          Available to {mode}
        </Text>
        <Text color="white" fontSize="inherit" textTransform="capitalize">
          {balance && FixedNumber.fromValue(balance, 18).toString().slice(0,8)} {currency}
        </Text>
      </Flex>
      <WeiBox
        amount={amount}
        decimals={18}
        setAmount={setAmount}
        icon={<TokenIcon symbol={currency} />}
        maxAmount={balance}
      />
    </VStack>
  );
};

export default InfoWeiBox;
