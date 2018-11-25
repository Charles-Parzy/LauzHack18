/* tslint:disable */
import * as React from "react";
import {Button, createStyles, Theme, withStyles, WithStyles, CircularProgress} from '@material-ui/core';
import {RouterStore} from 'mobx-react-router';
import {observer, inject} from 'mobx-react';
import AuthenticationStore from './Authentication/AuthenticationStore';
import ComponentContainer from './Utils/ComponentContainer';

const styles = (theme: Theme) => createStyles({
    button: {
        margin: 0,
    },
    container: {
        position: "absolute",
        top: "50%",
        transform: "translate(-50%, -50%)",
        left: "50%",
    },
    input: {
        display: 'none',
    },
    spinnerContainer: {
        display: "flex",
        flexContainer: "center",
        alignItems: "center",
    },
});

interface HomePageProps extends WithStyles<typeof styles> {
    routing: RouterStore;
    auth: AuthenticationStore;
}

@inject("routing", "auth") @observer
class HomePage extends React.Component<HomePageProps, {}> {

    public componentWillMount() {
        const {auth, routing} = this.props;
        const {location} = routing;
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        if (!!code) {
            // clear the stored token
            auth.token = "";
            this.generateToken(code);
        } else if (!!auth.token) {
            routing.push("/timeline");
        }
    }

    private generateToken(code: string): void {
        const {auth, routing} = this.props;
        const request = new Request(`http://localhost:8080/generateToken?code=${code}`);
        fetch(request).then(res => res.json())
            .then(res => {
                console.log('Success:', JSON.stringify(res));
                auth.token = res.access_token;
                routing.push("/timeline");
            })
            .catch(err => console.error("Error:", err));
    }

    public render() {
        const {auth, classes, routing} = this.props;
        const {location} = routing;
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        if (!!code) {
            return (
                <ComponentContainer
                    auth={auth}
                    barTitle="OpenHub"
                    back={false}
                    routing={this.props.routing}
                >
                    <div className={classes.spinnerContainer}>
                        <CircularProgress />
                    </div>
                </ComponentContainer>
            )
        }
        return (
            <ComponentContainer
                auth={auth}
                barTitle="OpenHub"
                back={false}
                routing={this.props.routing}
            >
                <div className={classes.container}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <img src="https://pbs.twimg.com/profile_images/767793963432546304/h-qs8imH_400x400.jpg" style={{width: 200, height: 200}}></img>
                        <div style={{margin: 20}}/>
                        <Button
                            variant="outlined"
                            href="https://github.com/login/oauth/authorize?&client_id=1eb8e00f3ac5bcfa3b42"
                            color="primary"
                            size="large"
                        >
                            Log In with GitHub
                        </Button>
                    </div>
                </div>
            </ComponentContainer>
        );
    }
}

export default withStyles(styles)(HomePage);