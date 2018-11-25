import * as React from "react";
import ComponentContainer from 'src/Utils/ComponentContainer';
import { Avatar, createStyles, WithStyles, withStyles, CircularProgress, Chip, Theme, TextField, Button } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import User from './User';
import { observable, computed } from 'mobx';
import AuthenticationStore from 'src/Authentication/AuthenticationStore';
import { observer, inject } from 'mobx-react';
import {RouterStore} from "mobx-react-router";

const styles = (theme: Theme) => createStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: "center"
    },
    card: {
        maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
          marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
        width: 150,
        height: 150,
    },
    spinnerContainer: {
        display: "flex",
        flexContainer: "center",
        alignItems: "center",
    },
    chip: {
        margin: theme.spacing.unit,
    },
    avatarContainer: {
        display: "flex",
        alignItems: "center"
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

interface UserProfileProps extends WithStyles<typeof styles> {
    auth: AuthenticationStore;
    routing: RouterStore;
}

@inject("auth", "routing") @observer
class UserProfile extends React.Component<UserProfileProps, {}> {
    @observable private _user: User;
    @computed get user(): User { return this._user; }
    set user(user: User) { this._user = user; }

    @observable private _topics: string[] = [];
    @computed get topics(): string[] { return this._topics; }
    set topics(topics: string[]) { this._topics = topics; }

    @observable private _languages: string[] = [];
    @computed get languages(): string[] { return this._languages; }
    set languages(languages: string[]) { this._languages = languages; }

    @observable private _waiting: boolean = false;
    @computed get waiting() { return this._waiting; }
    set waiting(waiting: boolean) { this._waiting = waiting; }

    @observable private _editing: boolean = false;
    @computed get editing(): boolean { return this._editing; }
    set editing(editing: boolean) { this._editing = editing; }

    @observable private _topicBeingAdded: string = "";
    @computed get topicBeingAdded(): string { return this._topicBeingAdded; }
    set topicBeingAdded(topicBeingAdded: string) { this._topicBeingAdded = topicBeingAdded; }

    @observable private _languageBeingAdded: string = "";
    @computed get languageBeingAdded(): string { return this._languageBeingAdded; }
    set languageBeingAdded(languageBeingAdded: string) { this._languageBeingAdded = languageBeingAdded; }

    public componentWillMount() {
        this.loadData();
    }

    private loadData() {
        const { auth } = this.props;
        this.waiting = true;
        const request = new Request(`http://localhost:8080/profile?token=${auth.token}`);
        fetch(request).then(res => res.json())
        .then(res => {
            console.log('Success:', JSON.stringify(res));
            this.user = new User(res.name, res.picture, res.topics, res.languages);
            this.topics = this.user.topics;
            this.languages = this.user.languages;
            this.waiting = false;
        })
        .catch(err => {
            console.error("Error:", err);
            this.waiting = false;
        });
    }

    private submitEditedData() {
        const { auth } = this.props;
        const request = new Request(
            "http://localhost:8080/tags", 
            {
                method: "POST",
                body: JSON.stringify({token: auth.token, languages: this.languages, topics: this.topics})
            }    
        );
        fetch(request);
    }

    private addNewTopic = () => {
        if (this.topics.indexOf(this.topicBeingAdded) !== -1) {
            return;
        }
        this.topics = [...this.topics, this.topicBeingAdded];
        this.topicBeingAdded = "";
    }

    private addNewLanguage = () => {
        if (this.languages.indexOf(this.languageBeingAdded) !== -1) {
            return;
        }
        this.languages = [...this.languages, this.languageBeingAdded];
        this.languageBeingAdded = "";
    }

    public render() {
        const { classes } = this.props;
        const buttonText = this.editing ? "Save" : "Edit";
        if (this.waiting) {
            return (
                <ComponentContainer
                    barTitle="User Profile"
                    back={true}
                    routing={this.props.routing}
                >   
                    <div className={classes.spinnerContainer}>
                        <CircularProgress />
                    </div>
                </ComponentContainer>
            );
        }  
        const saveCallback = () => {
            this.submitEditedData();
            this.editing = false;
        };
        const editCallback = () => {
            this.editing = true;
        }
        const buttonCallback = this.editing ? saveCallback : editCallback; 

        return (
            <ComponentContainer
                barTitle="User Profile"
                back={true}
                buttonText={buttonText}
                buttonVariant="contained"
                buttonCallback={buttonCallback}
                routing={this.props.routing}
            >   
                <div className={classes.container}>
                    <div className={classes.avatarContainer}>
                        <Avatar aria-label="Profile" className={classes.avatar} src=    {this.user.avatarUrl}>
                        </Avatar>
                        <h1 style={{ marginLeft: 20, fontSize: "xx-large" }}>
                            {this.user.name}
                        </h1>
                    </div>
                    <h2>
                        Topics
                    </h2>
                    <div style={{ display: "flex" }}>
                    {
                        this.topics.map((t, i) => <Chip key={i} label={t} className={classes.chip} />)
                    }
                    </div>
                    {
                        !this.topics.length && !this.editing && "Please choose some topics you are interested in"
                    }
                    {
                        this.editing && (
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    id="name"
                                    label="Name"
                                    className={classes.textField}
                                    value={this.topicBeingAdded}
                                    onChange={(e) => this.topicBeingAdded = e.target.value}
                                    margin="normal"
                                />
                                <Button color="primary" className={classes.button} onClick={this.addNewTopic}>
                                    Add Topic
                                </Button>
                            </div>
                        )
                    }
                    <h2>
                        Languages
                    </h2>
                    <div style={{ display: "flex" }}>
                    {
                        this.languages.map((l, i) => <Chip key={i} label={l} className={classes.chip} />)
                    }
                    </div>
                    {
                        !this.languages.length && !this.editing && "Please choose some programming languages you want to code"
                    }
                    {
                        this.editing && (
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    id="name"
                                    label="Name"
                                    className={classes.textField}
                                    value={this.languageBeingAdded}
                                    onChange={(e) => this.languageBeingAdded = e.target.value}
                                    margin="normal"
                                />
                                <Button color="primary" className={classes.button} onClick={this.addNewLanguage}>
                                    Add Language
                                </Button>
                            </div>
                        )
                    }
                </div>
            </ComponentContainer>
        );
    }
}

export default withStyles(styles)(UserProfile);