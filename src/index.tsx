import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store, { } from './redux/store';
import reportWebVitals from './reportWebVitals';
import type { AbstractConnector } from '@web3-react/abstract-connector';
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers'
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "react-query";
import { BigNumber, FixedNumber } from 'ethers';

const reactQueryClient = new QueryClient({
  queryCache: new QueryCache(),
});

function getWeb3Library(provider: any, connector?: AbstractConnector | undefined): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12_000;
  return library;
}

// function wrapper is used to enable HMR
function renderApp() {
  ReactDOM.render(
    <Web3ReactProvider getLibrary={getWeb3Library}>
      <Provider store={store}>
        <QueryClientProvider client={reactQueryClient}>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </QueryClientProvider>
      </Provider>
    </Web3ReactProvider>,
    document.getElementById("root")
  );
}

renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


if (process.env.NODE_ENV === "development" && module.hot) {
  (window as any).FixedNumber = FixedNumber;
  (window as any).BigNumber = BigNumber;
  module.hot.accept("./App", renderApp)
}