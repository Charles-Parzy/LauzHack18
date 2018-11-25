import * as React from "react";
import {AppBar, Toolbar, Typography, Button, createStyles, WithStyles, withStyles} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from "@material-ui/core/IconButton/IconButton";
import {RouterStore} from "mobx-react-router";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Fade from "@material-ui/core/Fade/Fade";
import { observer } from 'mobx-react';
import AuthenticationStore from 'src/Authentication/AuthenticationStore';


const styles = () => createStyles({
    childrenContainer: {
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
    },
    button: {
        // marginRight: -12,
        // marginLeft: 20,
    },
    flex: {
        flex: 1,
    }
})

interface ComponentContainerProps extends WithStyles<typeof styles> {
    barTitle: string;
    back: boolean;
    buttonCallback?: (event: any) => void;
    buttonText?: string;
    buttonVariant?: 'text' | 'flat' | 'outlined' | 'contained' | 'raised' | 'fab' | 'extendedFab';
    children: any;
    routing: RouterStore;
    auth: AuthenticationStore;
}

@observer
class ComponentContainer extends React.Component<ComponentContainerProps, {}> {
    public render() {
        const {auth, barTitle, buttonText, buttonCallback, buttonVariant, children, classes, back, routing} = this.props;
        const displayButton: boolean = !!buttonCallback && !!buttonText;
        let notifMsg: string = "";
        if (!!auth.notif) {
            if (auth.notif.prMerged) {
                notifMsg += "A new PR has been merged! ";
            } 
            if (auth.notif.newTrophy != "none") {
                notifMsg += `You got a new ${auth.notif.newTrophy} trophy!`;
            }
        }
        const action = (
            <Button color="secondary" size="small" onClick={() => auth.notif = undefined}>
              Close
            </Button>
          );
        return (
            <div>
                <AppBar position="fixed" color="default">
                    <Toolbar>
                        {back && (<IconButton onClick={() => routing.push("timeline")}><ChevronLeftIcon /></IconButton>)}
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            {barTitle}
                        </Typography>
                        {displayButton &&
                        <Button color="primary" className={classes.button} variant={buttonVariant || "text"}
                                onClick={buttonCallback}>{buttonText}</Button>}
                    </Toolbar>
                </AppBar>
                <AppBar position="fixed"/>
                <Toolbar/>
                <div className={classes.childrenContainer}>
                    {children}
                </div>
                <div>
                    <Snackbar
                        open={!!auth.notif}
                        onClose={() => auth.notif = undefined}
                        TransitionComponent={Fade}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">{notifMsg}</span>}
                        action={action}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ComponentContainer);