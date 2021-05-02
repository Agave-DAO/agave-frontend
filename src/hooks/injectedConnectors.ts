import { InjectedConnector } from "@web3-react/injected-connector";
import { useEffect, useMemo, useState } from "react";
import { useAppWeb3 } from "./appWeb3";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
    0x64, // XDAI
  ],
});

export function useAmbientConnection(
  key?: string | undefined
): { attempted: boolean; active: boolean } {
  const { active, activate } = useAppWeb3(key);
  // Init to active state to mean: If we are already active, don't bother doing anything
  const [tried, setTried] = useState(!!active);
  useEffect(() => {
    // TODO: Move into a useQuery invocation to track result state; Until then: intentionally forget the awaitable result
    if (!active && !tried) {
      injectedConnector.isAuthorized().then((authorized) => {
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

  return useMemo(() => ({ attempted: tried, active: !!active }), [
    tried,
    active,
  ]);
}
