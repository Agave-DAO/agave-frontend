import { afterEach, describe, expect, it, vi } from "vitest";
import { UnsupportedChainIdError } from "@web3-react/core";
import { BrowserWallet, BrowserWalletConnector, BrowserWalletProvider, discoverBrowserWallets } from "./browserWallets";

const account = "0x0000000000000000000000000000000000000001";
const otherAccount = "0x0000000000000000000000000000000000000002";
const cleanups: (() => void)[] = [];
afterEach(() => { cleanups.splice(0).forEach(cleanup => cleanup()); });

function provider() {
  const events = new Map<string, Set<(...args: any[]) => void>>();
  const state = { chain: "0x64", accounts: [account] };
  const wallet: BrowserWalletProvider = {
    request: vi.fn(async ({ method }) => method === "eth_chainId" ? state.chain : state.accounts),
    on: (event, listener) => {
      if (!events.has(event)) events.set(event, new Set());
      events.get(event)!.add(listener);
    },
    removeListener: (event, listener) => { events.get(event)?.delete(listener); },
  };
  const emit = (event: string, value?: unknown) => events.get(event)?.forEach(listener => listener(value));
  return { wallet, state, events, emit };
}

function announce(rdns: string, uuid: string, wallet = provider().wallet) {
  const detail = { info: { rdns, uuid, name: rdns }, provider: wallet };
  window.dispatchEvent(new CustomEvent("eip6963:announceProvider", { detail }));
  return detail;
}

describe("browser wallet discovery", () => {
  it("listens before requesting announcements and cleans up discovery", () => {
    const onRequest = () => { announce("io.rabby", "rabby"); };
    window.addEventListener("eip6963:requestProvider", onRequest);
    cleanups.push(() => window.removeEventListener("eip6963:requestProvider", onRequest));
    const discovery = discoverBrowserWallets(window);
    cleanups.push(discovery.destroy);
    const subscriber = vi.fn();
    discovery.subscribe(subscriber);
    expect(subscriber.mock.calls[0][0]).toHaveLength(1);
    discovery.destroy();
    announce("com.ambire.wallet", "ambire");
    discovery.subscribe(subscriber);
    expect(subscriber.mock.lastCall![0]).toHaveLength(1);
  });

  it("prioritizes Rabby and Ambire, retains MetaMask, and selects the exact announced provider", async () => {
    const discovery = discoverBrowserWallets(window);
    cleanups.push(discovery.destroy);
    let wallets: BrowserWallet[] = [];
    discovery.subscribe(value => { wallets = value; });
    const metamask = announce("io.metamask", "metamask");
    const ambire = announce("com.ambire.wallet", "ambire");
    const rabby = announce("io.rabby", "rabby");
    announce("io.rabby", "rabby", rabby.provider);
    expect(wallets.map(wallet => wallet.info.rdns)).toEqual(["io.rabby", "com.ambire.wallet", "io.metamask"]);
    const connector = new BrowserWalletConnector(wallets[1].provider);
    cleanups.push(() => connector.deactivate());
    await connector.activate();
    expect(await connector.getProvider()).toBe(ambire.provider);
    expect(ambire.provider.request).toHaveBeenCalledWith({ method: "eth_requestAccounts" });
    expect(metamask.provider.request).not.toHaveBeenCalled();
    expect(rabby.provider.request).not.toHaveBeenCalled();
  });

  it("ignores malformed announcements and unsubscribes without losing later wallets", () => {
    const discovery = discoverBrowserWallets(window);
    cleanups.push(discovery.destroy);
    const subscriber = vi.fn();
    const unsubscribe = discovery.subscribe(subscriber);
    window.dispatchEvent(new CustomEvent("eip6963:announceProvider", { detail: { info: { name: "bad" } } }));
    expect(subscriber).toHaveBeenCalledTimes(1);
    unsubscribe();
    announce("io.rabby", "rabby");
    expect(subscriber).toHaveBeenCalledTimes(1);
    const returningSubscriber = vi.fn();
    discovery.subscribe(returningSubscriber);
    expect(returningSubscriber.mock.calls[0][0]).toHaveLength(1);
  });
});

describe("browser wallet connector", () => {
  it("handles account and network changes and removes listeners on disconnect", async () => {
    const { wallet, emit, events } = provider();
    const connector = new BrowserWalletConnector(wallet);
    cleanups.push(() => connector.deactivate());
    const update = vi.fn();
    const error = vi.fn();
    const disconnect = vi.fn();
    connector.on("Web3ReactUpdate", update);
    connector.on("Web3ReactError", error);
    connector.on("Web3ReactDeactivate", disconnect);
    await connector.activate();
    emit("accountsChanged", [otherAccount]);
    expect(update).toHaveBeenLastCalledWith({ account: otherAccount });
    emit("chainChanged", "0x1");
    expect(error.mock.calls[0][0]).toBeInstanceOf(UnsupportedChainIdError);
    emit("chainChanged", "0x64");
    expect(update).toHaveBeenLastCalledWith({ chainId: 100, provider: wallet });
    emit("disconnect");
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect([...events.values()].every(listeners => listeners.size === 0)).toBe(true);
  });

  it("rejects unsupported chains without leaving listeners behind", async () => {
    const { wallet, state, events } = provider();
    state.chain = "0x1";
    const connector = new BrowserWalletConnector(wallet);
    await expect(connector.activate()).rejects.toBeInstanceOf(UnsupportedChainIdError);
    expect(events.size).toBe(0);
  });

  it("deactivates when account access is revoked", async () => {
    const { wallet, emit, events } = provider();
    const connector = new BrowserWalletConnector(wallet);
    const disconnect = vi.fn();
    connector.on("Web3ReactDeactivate", disconnect);
    await connector.activate();
    emit("accountsChanged", []);
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect([...events.values()].every(listeners => listeners.size === 0)).toBe(true);
  });
});
