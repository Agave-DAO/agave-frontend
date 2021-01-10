import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Layout from './layout';
import Markets from './views/Markets';
import ReserveOverview from './views/ReserveOverview';
import Dashboard from './views/Dashboard';
import Deposit from './views/Deposit';
import Borrow from './views/Borrow';
import { NotificationContainer } from 'react-notifications';
import theme from './theme';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Layout>
            <Switch>
              <Route path="/markets" component={Markets} exact />
              <Route path="/reserve-overview/:id" component={ReserveOverview} exact />
              <Route path="/dashboard" component={Dashboard} exact />
              <Route path="/deposit" component={Deposit} exact />
              <Route path="/borrow" component={Borrow} exact />
              <Redirect from="/" to="/markets" />
            </Switch>
            <NotificationContainer />
          </Layout>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
