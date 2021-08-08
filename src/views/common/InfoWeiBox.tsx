import React from "react";
import {
  VStack,
  Flex,
  Text,
  StackProps,
  useMediaQuery,
} from "@chakra-ui/react";
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
    decimals: number;
    setAmount: React.Dispatch<React.SetStateAction<BigNumber | undefined>>;
  } & StackProps
> = ({ mode, balance, currency, amount, decimals, setAmount, ...props }) => {
  const [isSmallerThan768] = useMediaQuery("(max-width: 765px)");
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
          {balance &&
            FixedNumber.fromValue(balance, decimals)
              .toString()
              .slice(0, decimals)}{" "}
          {currency}
        </Text>
      </Flex>
      <WeiBox
        amount={amount}
        decimals={decimals}
        setAmount={setAmount}
        icon={isSmallerThan768 ? null : <TokenIcon symbol={currency} />}
        maxAmount={balance}
      />
    </VStack>
  );
};

export default InfoWeiBox;
