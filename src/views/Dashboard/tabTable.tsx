import React from "react";
import {
  Center,
  Table,
  Tbody,
  Tr,
  Td,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
} from "@chakra-ui/react";
import { CenterProps } from "@chakra-ui/layout";
import { TokenIcon } from "../../utils/icons";

export const TabTable: React.FC<{
    type: string;
    coin: string;
    props?: CenterProps;

  }> = ({ type, coin, ...props }) => {

    return (
        <>
        <Table variant='unstyled'>
            <Tbody>
                <Tr>
                <Td>{type} Amount</Td>
                <Td textAlign={'right'} fontWeight="bold">Wallet Balance: 0.00</Td>
                </Tr>
            </Tbody>
        </Table>
        <Center>
            <InputGroup 
            borderColor='#044D44'
            bg='#044D44'
            width='95%'
            mt='0.5em'
            mb='0.5em'
            borderRadius='0.5em'
            h='6rem'
            >
            <InputLeftElement
                boxSizing="content-box"
                w="max-content"
                mx={4}
                h="100%"
                pl='1.5rem'
                isReadOnly
                children={
                <TokenIcon
                    symbol={coin}
                />
                }
            />
            <Input
                pl='7.5rem'
                pr='4.5rem'
                placeholder='0.0'
                bg='#044D44'
                h='100%'
                fontSize="5xl"
            />
            <InputRightElement 
                w='4.5rem' 
                h='100%'
                isReadOnly
                pr='5.5rem'
                fontSize='4xl'
            >{coin}</InputRightElement>
            </InputGroup>
        </Center>
        <Table variant='unstyled'>
            <Tbody>
                <Tr>
                    <Td>Utilization Rate</Td>
                    <Td textAlign={'right'} fontWeight="bold">89%</Td>
                </Tr>
                <Tr>
                    <Td>Available Liquidity</Td>
                    <Td textAlign={'right'} fontWeight="bold">0</Td>
                </Tr>
                <Tr>
                    <Td>{type} APY</Td>
                    <Td textAlign={'right'} fontWeight="bold">3.1684%</Td>
                </Tr>
                <Tr>
                    <Td>Collateralizable</Td>
                    <Td textAlign={'right'} fontWeight="bold">Yes</Td>
                </Tr>
                <Tr>
                    <Td>Maximum LTV</Td>
                    <Td textAlign={'right'} fontWeight="bold">80%</Td>
                </Tr>
                <Tr>
                    <Td>Asset Price</Td>
                    <Td textAlign={'right'} fontWeight="bold">$0.9999</Td>
                </Tr>
                <Tr>
                    <Td>Health Factor</Td>
                    <Td textAlign={'right'} fontWeight="bold">-</Td>
                </Tr>
            </Tbody>
        </Table>
        </>
    )
}