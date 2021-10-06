import { InjectedConnector } from "@web3-react/injected-connector";
import { FrameConnector } from "@web3-react/frame-connector";
import {
  WalletConnectConnector,
  WalletConnectConnectorArguments,
} from "@web3-react/walletconnect-connector";
import React, { useEffect, useMemo, useState } from "react";
import {
  ValidNetworkIds,
  internalAddressesPerNetworkId,
} from "../utils/contracts/contractAddresses/internalAddresses";
import { useAppWeb3 } from "./appWeb3";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: Object.values(ValidNetworkIds),
});

export const frameConnector = new FrameConnector({
  supportedChainIds: Object.values([0x64]), // Frame connector can only connect to one chain at a time, so let's just use XDAI
});

export const walletConnectConnector = new WalletConnectConnector({
  bridge: "https://bridge.walletconnect.org",
  // Generate an RPC table such that each chain we have RPCs for is present
  rpc: Object.fromEntries(
    Object.values(internalAddressesPerNetworkId)
      // Filter to chains which have an rpcUrl set
      // This filter-guard syntax is a result of .filter not propagating content information on its own
      .filter(
        (addr): addr is typeof addr & Required<Pick<typeof addr, "rpcUrl">> =>
          !!addr.rpcUrl
      )
      .map(addr => [addr.chainId, addr.rpcUrl] as const)
  ),
});

export interface AmbientConnectionState {
  key: string | DEFAULT_CONNECTION_KEY;
  tried: boolean;
}

export const ACTIVATING_WEB3_CONNECTOR: unique symbol = Symbol.for(
  "ActivatingWeb3Connector"
);
// eslint-disable-next-line
export type ACTIVATING_WEB3_CONNECTOR = typeof ACTIVATING_WEB3_CONNECTOR;

export const DEFAULT_CONNECTION_KEY: unique symbol = Symbol.for(
  "DefaultWeb3Connection"
);
// eslint-disable-next-line
export type DEFAULT_CONNECTION_KEY = typeof DEFAULT_CONNECTION_KEY;

export interface AmbientConnections {
  [ACTIVATING_WEB3_CONNECTOR]: object | undefined;
  [DEFAULT_CONNECTION_KEY]: AmbientConnectionState;
  [key: string]: AmbientConnectionState | undefined;
}

export const CreateAmbientConnectionContext = (): AmbientConnections => ({
  [ACTIVATING_WEB3_CONNECTOR]: undefined,
  [DEFAULT_CONNECTION_KEY]: {
    key: DEFAULT_CONNECTION_KEY,
    tried: false,
  },
});

export const AmbientConnectionContext = React.createContext<{
  connections: Readonly<AmbientConnections>;
  setConnections: (connections: Readonly<AmbientConnections>) => void;
}>({
  connections: CreateAmbientConnectionContext(),
  setConnections: () => {
    console.warn("No ambient connection context set");
  },
});
AmbientConnectionContext.displayName = "Web3AmbientConnections";

export function useAmbientConnectionContext(
  key?: string | undefined
): Readonly<{
  connection: Readonly<AmbientConnectionState>;
  setTried: (tried: boolean) => void;
  activatingConnector: object | undefined;
  setActivatingConnector: (activatingConnector: object | undefined) => void;
}> {
  const ctx = React.useContext(AmbientConnectionContext);
  const trueKey = key ?? DEFAULT_CONNECTION_KEY;
  let connection = ctx.connections[trueKey];
  React.useEffect(() => {
    if (connection === undefined) {
      connection = {
        key: trueKey,
        tried: false,
      };
      ctx.setConnections({ ...ctx.connections, [trueKey]: connection });
    }
  }, [ctx.connections, key]);
  return React.useMemo(() => {
    return {
      connection: connection!,
      setTried: tried => {
        ctx.setConnections({
          ...ctx.connections,
          [trueKey]: { ...connection!, tried },
        });
      },
      setActivatingConnector: activatingConnector => {
        ctx.setConnections({
          ...ctx.connections,
          [ACTIVATING_WEB3_CONNECTOR]: activatingConnector,
        });
      },
      activatingConnector: ctx.connections[ACTIVATING_WEB3_CONNECTOR],
    };
  }, [ctx, connection, key]);
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
