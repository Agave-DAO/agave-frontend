import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";

type KeysAllOrNothing = "account" | "library" | "chainId" | "connector";
export type AppWeb3Context = (
    Omit<Web3ReactContextInterface<Web3Provider>, KeysAllOrNothing>
    & (
        Pick<Required<Web3ReactContextInterface<Web3Provider>>, KeysAllOrNothing>
        | Record<KeysAllOrNothing, null | undefined>
    )
);

// A specialized response that types it such that, if any account information is available, all of it is
export function useAppWeb3(key?: string | undefined): AppWeb3Context {
    const res = useWeb3React<Web3Provider>(key);
    return res as AppWeb3Context;
}
