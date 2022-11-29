import React from "react";
import { CreateProxyLayout, ProxyLayout, WaitingLayout, ErrorLayout } from "./layout";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { getUserProxyAddress} from "../../queries/userProxy";
import { useUserProxyMutation } from "../../mutations/userProxy"

export const Swapper: React.FC<{}> = props => {
    
    const proxyAddress = getUserProxyAddress()['data'];
    const w3 = useAppWeb3();

    const userProxyMutation = useUserProxyMutation({
        chainId: w3.chainId ?? undefined,
        address: w3.account ?? undefined,
    });

    
    const userProxyMutationCall = React.useMemo(
    () => () =>
        w3.library
        ? userProxyMutation.mutate({ library: w3.library })
        : undefined,
    [userProxyMutation, w3.library]
    );


    console.log('getUserProxyAddress: ', getUserProxyAddress());

    if (proxyAddress === undefined) {
        return (
            <WaitingLayout />
        );
    } else if (proxyAddress === '0x0000000000000000000000000000000000000000') {
        return (
            <CreateProxyLayout mutationCall={userProxyMutationCall}/>
        );
    } else if (proxyAddress.slice(0,2) != '0x') {
        return (
            <ErrorLayout />
        );
    } else {
        return (
            <ProxyLayout />
        );       
    }
  };

