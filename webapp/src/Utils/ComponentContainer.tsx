import * as React from "react";
import {AppBar, Toolbar, Typography, Button, createStyles, WithStyles, withStyles} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from "@material-ui/core/IconButton/IconButton";
import {RouterStore} from "mobx-react-router";


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
}

class ComponentContainer extends React.Component<ComponentContainerProps, {}> {
    public render() {
        const {barTitle, buttonText, buttonCallback, buttonVariant, children, classes, back, routing} = this.props;
        const displayButton: boolean = !!buttonCallback && !!buttonText;
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
            </div>
        );
    }
}

export default withStyles(styles)(ComponentContainer);