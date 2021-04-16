import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Layout from './layout';
import Markets from './views/Markets';
// import ReserveOverview from './views/ReserveOverview';
// import Dashboard from './views/Dashboard';
import Deposit from './views/Deposit';
import DepositDetail from './views/Deposit/DepositDetail';
import DepositConfirm from './views/Deposit/DepositConfirm';
import Borrow from './views/Borrow';
import BorrowDetail from './views/Borrow/BorrowDetail';
import BorrowConfirm from './views/Borrow/BorrowConfirm';
// import WithdrawDetail from './views/Withdraw/WithdrawDetail';
// import WithdrawConfirm from './views/Withdraw/WithdrawConfirm';
// import RepayDetail from './views/Repay/RepayDetail';
// import RepayConfirm from './views/Repay/RepayConfirm';
// import Collateral from './views/Collateral';
// import InterestSwap from './views/InterestSwap';
import 'react-notifications-component/dist/theme.css';
import theme from './theme';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import "animate.css/animate.min.css";
import "react-notifications-component/dist/theme.css";
import ReactNotification from "react-notifications-component";
import { useReduxWeb3Updater } from './hooks/reduxWeb3';


interface IAppProps {
}

const App: React.FC<IAppProps> = props => {
  const notifications = React.useMemo(() => (<ReactNotification />), []);
  useReduxWeb3Updater();
  return (
    <ThemeProvider theme={theme}>
      {notifications}
      <Router>
        <Layout>
          <Switch>
            <Route path="/markets" component={Markets} exact />
            {/* <Route path="/reserve-overview/:assetName" component={ReserveOverview} exact /> */}
            {/* <Route path="/dashboard" component={Dashboard} exact /> */}
            <Route path="/deposit" component={Deposit} exact />
            <Route path="/deposit/:assetName" component={DepositDetail} exact />
            <Route path="/deposit/confirm/:assetName/:amount" component={DepositConfirm} exact />
            <Route path="/borrow" component={Borrow} exact />
            <Route path="/borrow/:assetName" component={BorrowDetail} exact />
            <Route path="/borrow/confirm/:assetName/:amount" component={BorrowConfirm} exact />
            {/* <Route path="/withdraw/:assetName" component={WithdrawDetail} exact /> */}
            {/* <Route path="/withdraw/confirm/:assetName/:amount" component={WithdrawConfirm} exact /> */}
            {/* <Route path="/repay/:assetName" component={RepayDetail} exact /> */}
            {/* <Route path="/repay/confirm/:assetName/:amount" component={RepayConfirm} exact /> */}
            {/* <Route path="/collateral/:assetName" component={Collateral} exact /> */}
            {/* <Route path="/interest-swap/:assetName" component={InterestSwap} exact /> */}
            <Redirect from="/" to="/markets" />
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
