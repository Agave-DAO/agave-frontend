import { act, render, screen } from "@testing-library/react";
import { Web3ReactProvider } from "@web3-react/core";
import React from "react";
import store from './redux/store';
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import type { AbstractConnector } from "@web3-react/abstract-connector";
import { Web3Provider } from "@ethersproject/providers";
import App from "./App";

const reactQueryClient = new QueryClient({
  queryCache: new QueryCache(),
});

function getWeb3Library(
  provider: any,
  connector?: AbstractConnector | undefined
): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12_000;
  return library;
}

test("renders learn react link", () => {
  act(() => {
    render(
      <Web3ReactProvider getLibrary={getWeb3Library}>
        <Provider store={store}>
          <QueryClientProvider client={reactQueryClient}>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </QueryClientProvider>
        </Provider>
      </Web3ReactProvider>
    );
  });
  const linkElement = screen.getByText(/Please connect your wallet/i);
  expect(linkElement).toBeInTheDocument();
});
