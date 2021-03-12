import React, { Component } from 'react';
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { setAddress, setNetworkId, setConnectType, setError } from "./redux/actions";
import { ThemeProvider } from 'styled-components';
import Layout from './layout';
import Markets from './views/Markets';
import ReserveOverview from './views/ReserveOverview';
import Dashboard from './views/Dashboard';
import Deposit from './views/Deposit';
import DepositDetail from './views/Deposit/DepositDetail';
import DepositConfirm from './views/Deposit/DepositConfirm';
import Borrow from './views/Borrow';
import BorrowDetail from './views/Borrow/BorrowDetail';
import BorrowConfirm from './views/Borrow/BorrowConfirm';
import WithdrawDetail from './views/Withdraw/WithdrawDetail';
import WithdrawConfirm from './views/Withdraw/WithdrawConfirm';
import RepayDetail from './views/Repay/RepayDetail';
import RepayConfirm from './views/Repay/RepayConfirm';
import Collateral from './views/Collateral';
import InterestSwap from './views/InterestSwap';
import { providerUrl, Web3 } from "./utils/web3";
import 'react-notifications/lib/notifications.css';
import theme from './theme';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { updateBalance } from './utils/constants';

class App extends Component {
  constructor(props) {
    super(props);
    window.web3 = null;
    // modern broswers
    if (typeof window.ethereum !== "undefined") {
      window.web3 = new Web3(window.ethereum);
      window.web3.eth.net.getId((err, netId) => {
        console.log(netId)
        console.log(this.props.setErrorRequest(true))
        this.handleNetworkChanged(`${netId}`);
        window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
          if (accounts[0]) {
            this.props.setAddressRequest(accounts[0]);
            updateBalance(accounts[0]);
          }
        });
        window.ethereum.on("accountsChanged", (accounts) =>
          this.handleAddressChanged(accounts)
        );
        window.ethereum.on("networkChanged", (networkId) =>{
          console.log(networkId)
          this.handleNetworkChanged(networkId)
        });
        this.props.setConnectTypeRequest('metamask');
      });
    }

    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.web3 = null;
    }
  }

  handleAddressChanged = (accounts) => {
    if (typeof window.ethereum !== "undefined") {
      if (accounts[0]) {
        this.props.setAddressRequest(accounts[0]);
      } else {
        this.props.setAddressRequest(null);
        this.props.setNetworkIdRequest(null);
        this.props.setConnectTypeRequest('');        
      }
    }
  };

  handleNetworkChanged = (networkId) => {
    this.props.setNetworkIdRequest(networkId);
    switch (networkId) {
      case "1":
        if (String(providerUrl).includes("mainnet")) {
          this.props.setErrorRequest(false);
        } else {
          this.props.setErrorRequest(true);
        }
        break;
      case "4":
        if (String(providerUrl).includes("rinkeby")) {
          this.props.setErrorRequest(false);
        } else {
          this.props.setErrorRequest(true);
        }
        break;
      default:
        this.props.setErrorRequest(true);
    }
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Layout>
            <Switch>
              <Route path="/markets" component={Markets} exact />
              <Route path="/reserve-overview/:assetName" component={ReserveOverview} exact />
              <Route path="/dashboard" component={Dashboard} exact />
              <Route path="/deposit" component={Deposit} exact />
              <Route path="/deposit/:assetName" component={DepositDetail} exact />
              <Route path="/deposit/confirm/:assetName/:amount" component={DepositConfirm} exact />
              <Route path="/borrow" component={Borrow} exact />
              <Route path="/borrow/:assetName" component={BorrowDetail} exact />
              <Route path="/borrow/confirm/:assetName/:amount" component={BorrowConfirm} exact />
              <Route path="/withdraw/:assetName" component={WithdrawDetail} exact />
              <Route path="/withdraw/confirm/:assetName/:amount" component={WithdrawConfirm} exact />
              <Route path="/repay/:assetName" component={RepayDetail} exact />
              <Route path="/repay/confirm/:assetName/:amount" component={RepayConfirm} exact />
              <Route path="/collateral/:assetName" component={Collateral} exact />
              <Route path="/interest-swap/:assetName" component={InterestSwap} exact />
              <Redirect from="/" to="/markets" />
            </Switch>
          </Layout>
        </Router>
      </ThemeProvider>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAddressRequest: (address) => dispatch(setAddress(address)),
    setNetworkIdRequest: (networkId) => dispatch(setNetworkId(networkId)),
    setConnectTypeRequest: (connectType) => dispatch(setConnectType(connectType)),
    setErrorRequest: (error) => dispatch(setError(error)),
  };
};

export default connect(null, mapDispatchToProps)(App);
