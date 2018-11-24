/* tslint:disable */
import * as React from "react";
import { Button, createStyles, Icon, Theme, withStyles, WithStyles } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
    button: {
        margin: theme.spacing.unit,
      },
      input: {
        display: 'none',
      },
});

interface HomePageProps extends WithStyles<typeof styles> {

}

class HomePage extends React.Component<HomePageProps, {}> {
    public render() {
        const { classes } = this.props;
        return (
            <Button 
                variant="outlined" 
                className={classes.button}
                href="https://github.com/login/oauth/authorize?scope=user:email&client_id=1eb8e00f3ac5bcfa3b42"
            >
                <Icon />
                Log In with GitHub
            </Button>
        );
    }
}

export default withStyles(styles)(HomePage);