import * as React from "react";
import { AppBar, Toolbar, Typography, Button, createStyles, WithStyles, withStyles } from '@material-ui/core';

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

interface ComponentContainerProps extends WithStyles<typeof styles>  {
    barTitle: string;
    buttonCallback?: (event: any) => void;
    buttonText?: string;
    buttonVariant?: 'text' | 'flat' | 'outlined' | 'contained' | 'raised' | 'fab' | 'extendedFab';
    children: any;
}

class ComponentContainer extends React.Component<ComponentContainerProps, {}> {
    public render() {
        const { barTitle, buttonText, buttonCallback, buttonVariant, children, classes } = this.props;
        const displayButton: boolean = !!buttonCallback && !!buttonText;
        return (
            <div>
                <AppBar position="fixed" color="default">
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            {barTitle}
                        </Typography>
                        { displayButton && <Button color="primary" className={classes.button} variant={buttonVariant || "text"} onClick={buttonCallback}>{buttonText}</Button>}
                    </Toolbar>
                </AppBar>
                <AppBar position="fixed" />
                <Toolbar />
                <div className={classes.childrenContainer}>
                    {children}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ComponentContainer);