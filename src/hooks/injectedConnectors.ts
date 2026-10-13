import React, { useEffect, useMemo } from "react";
import { useAppWeb3 } from "./appWeb3";

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
  const { active } = useAppWeb3(key);
  const {
    connection: { tried },
    setTried,
  } = useAmbientConnectionContext(key);
  // Wallet choice is explicit; never reconnect through a shared window.ethereum.
  useEffect(() => {
    if (!tried) setTried(true);
  }, [tried, setTried]);

  return useMemo(
    () => ({
      attempted: tried,
      active: !!active,
      activating: !tried && !active,
    }),
    [tried, active]
  );
}
