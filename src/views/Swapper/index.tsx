import React, { useEffect } from "react";
import { CreateProxyLayout, ProxyLayout, WaitingLayout, ErrorLayout } from "./layout";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { getUserProxyAddressQuery} from "../../queries/userProxy";
import { useUserProxyMutation } from "../../mutations/userProxy"

export interface SwapperProps {
    userProxyAddress: string | undefined;
}

export const Swapper: React.FC<SwapperProps> = props => {
    const w3 = useAppWeb3();
    const userProxyAddress = getUserProxyAddressQuery()['data'];
    const [layout, setLayout] = React.useState(<WaitingLayout />);

    const userProxyMutation = useUserProxyMutation({
        chainId: w3.chainId ?? undefined,
        address: w3.account ?? undefined,
    });

    const userProxyMutationCall = React.useMemo(
    () => () =>
        w3.library
        ? userProxyMutation.mutate({ library: w3.library, setLayout })
        : undefined,
    [userProxyMutation, w3.library]
    );

    useEffect(()=> {
        console.log("userProxyAddress",userProxyAddress);
        if (userProxyAddress === undefined) {
            setLayout(<WaitingLayout />);
        } else if (userProxyAddress === '0x0000000000000000000000000000000000000000') {
            setLayout(<CreateProxyLayout mutationCall={userProxyMutationCall}/>);
        } else if (userProxyAddress.slice(0,2) != '0x') {
           setLayout(<ErrorLayout />);
        } else {
           setLayout(<ProxyLayout />);
        }
    },[userProxyAddress]);

    return (
        layout
    );

  };

