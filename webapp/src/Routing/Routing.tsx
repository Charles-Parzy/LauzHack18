/* tslint:disable */
import * as React from "react";
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router, Route, Switch } from 'react-router';
import AuthenticationStore from 'src/Authentication/AuthenticationStore';
import HomePage from "../HomePage";
import ProjectProfile from 'src/ProjectProfile/ProjectProfile';
import TimelineStore from 'src/Timeline/TimelineStore';
import Timeline from 'src/Timeline/Timeline';
import UserProfile from 'src/UserProfile/UserProfile';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const authStore = new AuthenticationStore();
const timelineStore = new TimelineStore();

const stores = {
  // Key can be whatever you want
  routing: routingStore,
  auth: authStore,
  timeline: timelineStore,
  // ...other stores
};

const history = syncHistoryWithStore(browserHistory, routingStore);

export default class Routing extends React.Component<{}, {}> {

    public render() {
        return (
            <Provider {...stores}>
                <Router history={history}>
                    <Switch>
                        <Route exact={true} path="/" component={HomePage} />
                        <Route path="/timeline" component={Timeline} />
                        <Route path="/project" component={ProjectProfile} />
                        <Route path="/profile" component={UserProfile} />
                    </Switch>
                </Router>
            </Provider>
        );
    }
}