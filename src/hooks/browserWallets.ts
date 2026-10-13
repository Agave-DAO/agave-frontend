import { AbstractConnector } from "@web3-react/abstract-connector";
import { UnsupportedChainIdError } from "@web3-react/core";
import { useEffect, useState } from "react";

export interface BrowserWalletProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: string, listener: (...args: any[]) => void): void;
  removeListener(event: string, listener: (...args: any[]) => void): void;
}

export interface BrowserWallet {
  info: { uuid: string; name: string; rdns: string };
  provider: BrowserWalletProvider;
}

const priority = (wallet: BrowserWallet) =>
  wallet.info.rdns === "io.rabby" ? 0 :
  wallet.info.rdns === "com.ambire.wallet" ? 1 :
  wallet.info.rdns === "io.metamask" ? 2 : 3;

export function discoverBrowserWallets(target: Window) {
  let wallets: BrowserWallet[] = [];
  const subscribers = new Set<(wallets: BrowserWallet[]) => void>();
  const announce = (event: Event) => {
    const detail = (event as CustomEvent<BrowserWallet>).detail;
    if (
      !detail || !detail.info ||
      typeof detail.info.uuid !== "string" || !detail.info.uuid ||
      typeof detail.info.name !== "string" || !detail.info.name ||
      typeof detail.info.rdns !== "string" ||
      typeof detail.provider?.request !== "function" ||
      typeof detail.provider.on !== "function" ||
      typeof detail.provider.removeListener !== "function" ||
      wallets.some(wallet => wallet.info.uuid === detail.info.uuid || wallet.provider === detail.provider)
    ) return;
    // Copy display metadata; announcements are self-attested, not wallet identity proofs.
    wallets = [...wallets, {
      info: { uuid: detail.info.uuid, name: detail.info.name.slice(0, 80), rdns: detail.info.rdns },
      provider: detail.provider,
    }].sort((a, b) => priority(a) - priority(b) || a.info.name.localeCompare(b.info.name));
    subscribers.forEach(subscriber => subscriber(wallets));
  };
  target.addEventListener("eip6963:announceProvider", announce);
  target.dispatchEvent(new Event("eip6963:requestProvider"));
  return {
    subscribe(subscriber: (wallets: BrowserWallet[]) => void) {
      subscribers.add(subscriber);
      subscriber(wallets);
      return () => { subscribers.delete(subscriber); };
    },
    destroy() {
      target.removeEventListener("eip6963:announceProvider", announce);
      subscribers.clear();
    },
  };
}

let discovery: ReturnType<typeof discoverBrowserWallets> | undefined;
export function useBrowserWallets() {
  const [wallets, setWallets] = useState<BrowserWallet[]>([]);
  useEffect(() => {
    // Keep the announcement listener for the page lifetime, including late injection.
    discovery ??= discoverBrowserWallets(window);
    return discovery.subscribe(setWallets);
  }, []);
  return wallets;
}

function firstAccount(accounts: unknown): string | null {
  if (!Array.isArray(accounts) || accounts.length === 0) return null;
  if (typeof accounts[0] !== "string" || !/^0x[\da-f]{40}$/i.test(accounts[0])) {
    throw new Error("Wallet returned an invalid account");
  }
  return accounts[0];
}

export class BrowserWalletConnector extends AbstractConnector {
  constructor(private readonly provider: BrowserWalletProvider) {
    super({ supportedChainIds: [100] });
  }

  private accountsChanged = (accounts: unknown) => {
    try {
      const account = firstAccount(accounts);
      if (account) this.emitUpdate({ account });
      else this.disconnected();
    } catch (error) {
      this.emitError(error as Error);
    }
  };

  private chainChanged = (chain: unknown) => {
    const chainId = Number(chain);
    if (chainId !== 100) this.emitError(new UnsupportedChainIdError(chainId, [100]));
    else this.emitUpdate({ chainId, provider: this.provider });
  };

  private disconnected = () => {
    this.deactivate();
    this.emitDeactivate();
  };

  async activate() {
    this.deactivate();
    const account = firstAccount(await this.provider.request({ method: "eth_requestAccounts" }));
    if (!account) throw new Error("Wallet did not authorize an account");
    const chainId = await this.getChainId();
    if (chainId !== 100) throw new UnsupportedChainIdError(chainId, [100]);
    this.provider.on("accountsChanged", this.accountsChanged);
    this.provider.on("chainChanged", this.chainChanged);
    this.provider.on("disconnect", this.disconnected);
    return { provider: this.provider, account, chainId };
  }

  async getProvider() { return this.provider; }
  async getChainId() { return Number(await this.provider.request({ method: "eth_chainId" })); }
  async getAccount() { return firstAccount(await this.provider.request({ method: "eth_accounts" })); }

  deactivate() {
    this.provider.removeListener("accountsChanged", this.accountsChanged);
    this.provider.removeListener("chainChanged", this.chainChanged);
    this.provider.removeListener("disconnect", this.disconnected);
  }
}
