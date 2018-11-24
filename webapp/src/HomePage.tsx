/* tslint:disable */
import * as React from "react";
import { Button, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import { RouterStore } from 'mobx-react-router';
import { observer, inject } from 'mobx-react';
import AuthenticationStore from './Authentication/AuthenticationStore';

const styles = (theme: Theme) => createStyles({
    button: {
        margin: 0,
    },
    container: {
        position: "fixed", /* or absolute */
        top: "50%",
        left: "50%",
    },
    input: {
        display: 'none',
    },
});

interface HomePageProps extends WithStyles<typeof styles> {
    routing: RouterStore;
    auth: AuthenticationStore;
}

@inject("routing", "auth") @observer
class HomePage extends React.Component<HomePageProps, {}> {

    public componentWillMount() {
        const { auth, routing } = this.props;
        const { location } = routing;
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
        const { auth, routing } = this.props;
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
        const { classes } = this.props;
        return (
            // <div className={classes.container}>
                <Button 
                    variant="outlined" 
                    className={classes.container}
                    href="https://github.com/login/oauth/authorize?&client_id=1eb8e00f3ac5bcfa3b42"
                    color="primary"
                >
                    Log In with GitHub
                </Button>
            // </div>
        );
    }
}

export default withStyles(styles)(HomePage);