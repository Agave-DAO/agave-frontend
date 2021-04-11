import { Erc20abi__factory } from "../../../contracts/factories/Erc20abi__factory";
import { AgaveLendingABI__factory } from "../../../contracts/factories/AgaveLendingABI__factory";
import { externalAddresses } from "../contractAddresses/externalAdresses";
import { internalAddresses } from "../contractAddresses/internalAddresses";
import type { IMarketData } from "../../constants";
import type { BigNumber, Signer } from "ethers";
import type { Provider } from "@ethersproject/abstract-provider";
import type {
  TypedEvent,
  TypedEventFilter,
  TypedListener,
} from "../../../contracts/commons";

export interface TypedEventContract<EventArgsArray, EventArgsObject> {
  on<EventArgsArray extends Array<unknown>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  off<EventArgsArray extends Array<unknown>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
}

export type TypedFilteringListener<
  T,
  EventArgsArray extends Array<unknown>,
  EventArgsObject
> = (
  ...listenerArg: [
    ...EventArgsArray,
    TypedEvent<EventArgsArray & EventArgsObject>
  ]
) => T | undefined;

export function listenUntil<
  ArgsArray extends Array<unknown>,
  ArgsObj extends unknown,
  T = [...ArgsArray, TypedEvent<ArgsArray & ArgsObj>]
>(
  emitter: TypedEventContract<ArgsArray, ArgsObj>,
  filter: TypedEventFilter<ArgsArray, ArgsObj>,
  listener: TypedFilteringListener<T, ArgsArray, ArgsObj>
): {
  cancel: () => void;
  result: Promise<T>;
} {
  let cancel: (() => void) | undefined = undefined;
  const result = new Promise<T>((resolve, reject) => {
    const metaListener: TypedListener<ArgsArray, ArgsObj> = (...args) => {
      const listenerRes = listener(...args);
      if (listenerRes) {
        emitter.off(filter, metaListener);
        resolve(listenerRes);
      }
    };
    cancel = () => {
      emitter.off(filter, metaListener);
      reject("Cancelled");
    };
  });
  return {
    cancel: cancel ?? (() => {}),
    result,
  };
}

export const approveSpendListener = async (
  address: string,
  asset: IMarketData,
  hash: string,
  signerOrProvider: Signer | Provider,
) => {
  const contractInstance = Erc20abi__factory.connect(
    asset.contractAddress,
    signerOrProvider
  );
  const filter = contractInstance.filters.Approval(null, null, null);

  const ev = await listenUntil(
    contractInstance,
    filter,
    (
      owner: string,
      spender: string,
      value: BigNumber,
      ev
    ) => {
      if (hash === ev.transactionHash) {
        return {
          status: true,
          ...ev,
        };
      }
    }
  ).result;

  return ev;
};

export const depositListener = async (
  hash: string,
  signerOrProvider: Signer | Provider
) => {
  const contractInstance = AgaveLendingABI__factory.connect(
    internalAddresses.Lending,
    signerOrProvider
  );
  const filter = contractInstance.filters.Deposit(null, null, null, null, null);

  const ev = await listenUntil(
    contractInstance,
    filter,
    (
      reserve: string,
      user: string,
      onBehalfOf: string,
      amount: BigNumber,
      referral: number,
      ev
    ) => {
      if (hash === ev.transactionHash) {
        return {
          status: true,
          ...ev,
        };
      }
    }
  ).result;

  return ev;
};

export const withdrawListener = async (
  hash: string,
  signerOrProvider: Signer | Provider
) => {
  const contractInstance = AgaveLendingABI__factory.connect(
    internalAddresses.Lending,
    signerOrProvider
  );
  const filter = contractInstance.filters.Withdraw(null, null, null, null);

  const ev = await listenUntil(
    contractInstance,
    filter,
    (reserve: string, user: string, to: string, amount: BigNumber, ev) => {
      if (hash === ev.transactionHash) {
        return {
          status: true,
          ...ev,
        };
      }
    }
  ).result;

  return ev;
};

export const reserveListener = async (
  hash: string,
  signerOrProvider: Signer | Provider
) => {
  const contractInstance = AgaveLendingABI__factory.connect(
    internalAddresses.Lending,
    signerOrProvider
  );
  const filter = contractInstance.filters.ReserveUsedAsCollateralEnabled(
    null,
    null
  );

  const ev = await listenUntil(
    contractInstance,
    filter,
    (reserve: string, user: string, ev) => {
      if (hash === ev.transactionHash) {
        return {
          status: true,
          ...ev,
        };
      }
    }
  ).result;

  return ev;
};

export const borrowListener = async (
  hash: string,
  signerOrProvider: Signer | Provider
) => {
  const contractInstance = AgaveLendingABI__factory.connect(
    internalAddresses.Lending,
    signerOrProvider
  );
  const filter = contractInstance.filters.Borrow(
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );

  const ev = await listenUntil(
    contractInstance,
    filter,
    (
      reserve: string,
      user: string,
      onBehalfOf: string,
      amount: BigNumber,
      borrowRateMode: BigNumber,
      borrowRate: BigNumber,
      referral: number,
      ev
    ) => {
      if (hash === ev.transactionHash) {
        return {
          status: true,
          ...ev,
        };
      }
    }
  ).result;

  return ev;
};

export const repayListener = async (
  hash: string,
  signerOrProvider: Signer | Provider
) => {
  const contractInstance = AgaveLendingABI__factory.connect(
    internalAddresses.Lending,
    signerOrProvider
  );
  const filter = contractInstance.filters.Repay(null, null, null, null);

  const ev = await listenUntil(
    contractInstance,
    filter,
    (reserve: string, user: string, repayer: string, amount: BigNumber, ev) => {
      if (hash === ev.transactionHash) {
        return {
          status: true,
          ...ev,
        };
      }
    }
  ).result;

  return ev;
};
