import { InjectedConnector } from "@web3-react/injected-connector";
import React, { useEffect, useMemo, useState } from "react";
import { ValidNetworkIds } from "../utils/contracts/contractAddresses/internalAddresses";
import { useAppWeb3 } from "./appWeb3";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: Object.values(ValidNetworkIds),
});

export interface AmbientConnectionState {
  key: string | DEFAULT_CONNECTION_KEY;
  tried: boolean;
}

export const DEFAULT_CONNECTION_KEY: unique symbol = Symbol.for(
  "DefaultWeb3Connection"
);
// eslint-disable-next-line
export type DEFAULT_CONNECTION_KEY = typeof DEFAULT_CONNECTION_KEY;

export interface AmbientConnections {
  [DEFAULT_CONNECTION_KEY]: AmbientConnectionState;
  [key: string]: AmbientConnectionState | undefined;
}

export const CreateAmbientConnectionContext = (): AmbientConnections => ({
  [DEFAULT_CONNECTION_KEY]: {
    key: DEFAULT_CONNECTION_KEY,
    tried: false,
  },
});

export const AmbientConnectionContext = React.createContext<AmbientConnections>(
  CreateAmbientConnectionContext()
);
AmbientConnectionContext.displayName = "Web3AmbientConnections";

export function useAmbientConnectionContext(key?: string | undefined): {
  connection: AmbientConnectionState;
  setTried: (tried: boolean) => void;
} {
  const ctx = React.useContext(AmbientConnectionContext);
  return React.useMemo(() => {
    const trueKey = key ?? DEFAULT_CONNECTION_KEY;
    let connection = ctx[trueKey];
    if (connection === undefined) {
      connection = {
        key: trueKey,
        tried: false,
      };
      ctx[trueKey] = connection;
    }
    return { connection, setTried: tried => (connection!.tried = tried) };
  }, [ctx, key]);
}

export function useAmbientConnection(key?: string | undefined): {
  attempted: boolean;
  active: boolean;
  activating: boolean;
} {
  const { active, activate } = useAppWeb3(key);
  const {
    connection: { tried },
    setTried,
  } = useAmbientConnectionContext(key);
  // Init to active state to mean: If we are already active, don't bother doing anything
  useEffect(() => {
    // TODO: Move into a useQuery invocation to track result state; Until then: intentionally forget the awaitable result
    if (!active && !tried) {
      injectedConnector.isAuthorized().then(authorized => {
        if (authorized) {
          activate(injectedConnector, undefined, true).catch(() => {
            setTried(true); // An attempt was made
          });
        } else {
          setTried(true);
        }
      });
    }
  }); // Only fire once on mount

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return useMemo(
    () => ({
      attempted: tried,
      active: !!active,
      activating: !tried && !active,
    }),
    [tried, active]
  );
}
