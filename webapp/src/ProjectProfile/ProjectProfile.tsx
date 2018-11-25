import * as React from 'react';
import './ProjectProfile.css';
import {Issue, Project} from "../GithubProject";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ComponentContainer from 'src/Utils/ComponentContainer';
import AuthenticationStore from "../Authentication/AuthenticationStore";
import {inject, observer} from "mobx-react";
import {computed, observable} from "mobx";
import {RouterStore} from "mobx-react-router";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

interface ProjectProfileState {
}

interface ProjectProfileProps {
    auth: AuthenticationStore;
    routing: RouterStore;
}

@inject("auth", "routing") @observer
class ProjectProfile extends React.Component<ProjectProfileProps, ProjectProfileState> {

    @observable private _project: Project;
    @observable private _followed: boolean;
    @observable private _waiting: boolean = false;


    @computed get project() {
        return this._project;
    }

    set project(project: Project) {
        this._project = project;
    }

    @computed get followed() {
        return this._followed;
    }

    set followed(followed: boolean) {
        this._followed = followed;
    }

    @computed get waiting(): boolean {
        return this._waiting;
    }

    set waiting(waiting: boolean) {
        this._waiting = waiting;
    }

    componentWillMount(): void {
        const {auth, routing} = this.props;
        const {location} = routing;
        const params = new URLSearchParams(location.search);
        const owner = params.get('owner');
        const repo = params.get('repo');

        fetch(new Request(`http://localhost:8080/project?token=${auth.token}&owner=${owner}&repo=${repo}`)).then(res => res.json()).then(res => {
            console.log('Success:', res);
            this.project = Project.fromJson(res);
            this.followed = res.followed;
            this.waiting = false;

        }).catch(reason => console.log(reason));

        this.waiting = true;
    }

    public render() {
        const {followed, project, waiting} = this;

        if (waiting) {
            return (
                <div className="spinnerContainer">
                    <CircularProgress/>
                </div>
            );
        }

        return (
            <ComponentContainer
                barTitle="Repository"
                buttonCallback={() => this.updateFollow()}
                buttonText={followed ? "Unfollow" : "Follow"}
                buttonVariant={followed ? "outlined" : "contained"}
            >
                <div className="information">
                    <div className="title">
                        <Typography variant="h2">{project.getTitle()}</Typography>
                    </div>
                    <div className="details">
                        <Typography variant="h6">
                            {project.description}
                        </Typography>
                        {this.createTagList(project)}
                    </div>

                </div>
                <div className="card">
                    <Card>
                        <CardContent>
                            <div className="issues">
                                <Typography component="p" variant="h6">Issues:</Typography>
                                {this.createIssueList(project)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ComponentContainer>
        );
    }

    private updateFollow(): void {
        const {followed, project} = this;
        console.log(followed);
        let url: string = `http://localhost:8080/${followed ? "unfollow" : "follow"}?token=${this.props.auth.token}&owner=${project.user}&repo=${project.name}`;
        const request = new Request(url);
        fetch(request).then(res => res.json())
            .then(unused => {
                this.followed = !followed;
            })
            .catch(err => console.error("Error:", err));
    }

    createTagList(project: Project) {
        return (
            <div className="tags">
                {
                    project.tags.map(function (tag: string) {
                        return <span key={tag} className="tag-chip"><Button size="small" variant="outlined"
                                                                            href={"http://github.com/topics/" + tag}>{tag}</Button></span>
                    })
                }
            </div>
        )
    }

    createIssueList(project: Project) {
        return (
            <List>
                {project.issues.map(function (issue: Issue, index: number) {
                    return <ListItem key={index} button component="a"
                                     href={issue.url(project.user, project.name)}><ListItemText primary={issue.title}
                                                                                                secondary={issue.subtext}/></ListItem>;
                })}
            </List>
        )
    }
}


export default ProjectProfile;
