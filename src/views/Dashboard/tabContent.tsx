import React from "react";
import {
  Center,
  Button,
  TabPanels, 
  TabPanel,
} from "@chakra-ui/react";
import { CenterProps } from "@chakra-ui/layout";
import { fontSizes } from "../../utils/constants";
import { TabTable } from "./tabTable";

export const TabContent: React.FC<{
    type: string;
    coin: string;
    props?: CenterProps;

  }> = ({ type, coin, ...props }) => {
    return (
        <>
        <TabPanels border='1px' borderColor='white'>
          <TabPanel>
            <TabTable 
              type={type}
              coin={coin}
            />
          </TabPanel>
          <TabPanel>
          <TabTable 
              type={type}
              coin={coin}
            />
          </TabPanel>
        </TabPanels>
        <Center mb='1em'>
          <Button
            background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
            color="secondary.900"
            px={{ base: "10rem", md: "6rem" }}
            py="1.5rem"
            fontSize={fontSizes.md}
            mt="2rem"
          >{type}</Button>
        </Center>
        </>
    );
  };
  