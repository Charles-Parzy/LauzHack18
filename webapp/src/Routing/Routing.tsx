/* tslint:disable */
import * as React from "react";
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router, Route } from 'react-router';
import AuthenticationStore from 'src/Authentication/AuthenticationStore';
import HomePage from "../HomePage";

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const authStore = new AuthenticationStore();

const stores = {
  // Key can be whatever you want
  routing: routingStore,
  auth: authStore,
  // ...other stores
};

const history = syncHistoryWithStore(browserHistory, routingStore);

export default class Routing extends React.Component<{}, {}> {

    public render() {
        return (
            <Provider {...stores}>
                <Router history={history}>
                <Route path="/" component={HomePage} />
                </Router>
            </Provider>
        );
    }
}