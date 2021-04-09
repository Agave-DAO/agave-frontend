import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store, { } from './redux/store';
import reportWebVitals from './reportWebVitals';
import type { AbstractConnector } from '@web3-react/abstract-connector';
import { Web3ReactProvider } from "@web3-react/core";

function getWeb3Library(provider: any, connector?: AbstractConnector | undefined) {
}

// function wrapper is used to enable HMR
function renderApp() {
  ReactDOM.render(
    <Web3ReactProvider getLibrary={getWeb3Library}>
      <Provider store={store}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
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
  module.hot.accept("./App", renderApp)
}