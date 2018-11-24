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

interface ProjectProfileState {
}

interface ProjectProfileProps {
    auth: AuthenticationStore;
}

@inject("auth") @observer
class ProjectProfile extends React.Component<ProjectProfileProps, ProjectProfileState> {

    @observable private _project: Project;
    @observable private _followed: boolean;

    @computed get project() {
        return this._project;
    }

    set project(project: Project) {
        this._project = project;
    }

    @computed get follow() {
        return this._followed;
    }

    set followed(followed: boolean) {
        this._followed = followed;
    }

    componentWillMount(): void {
        this.project = new Project(
            "dotty-id",
            "lampepfl",
            "dotty",
            "Research compiler that will become Scala 3 ",
            ["scala", "scala3", "epfl", "language-server-protocol", "compiler"],
            [new Issue("2543", "Require `case` prefix for patterns in for-comprehension generators", "#871263 opened 3 days ago"),
                new Issue("2543", "Require `case` prefix for patterns in for-comprehension generators", "#871263 opened 3 days ago"),
                new Issue("2543", "Require `case` prefix for patterns in for-comprehension generators", "#871263 opened 3 days ago"),
                new Issue("2543", "Require `case` prefix for patterns in for-comprehension generators", "#871263 opened 3 days ago"),
                new Issue("2543", "Require `case` prefix for patterns in for-comprehension generators", "#871263 opened 3 days ago")
            ],
            false);
    }

    public render() {
        const {project} = this;
        const follow: boolean = project.followed;

        return (
            <ComponentContainer
                barTitle="Repository"
                buttonCallback={() => this.updateFollow(!project.followed)}
                buttonText={project.printFollow()}
                buttonVariant={follow ? "outlined" : "contained"}
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
                    <Card><CardContent>
                        <div className="issues">
                            <Typography component="p" variant="h6">Issues:</Typography>
                            {this.createIssueList(project)}
                        </div>
                    </CardContent></Card>
                </div>
            </ComponentContainer>
        );
    }

    private updateFollow(followed: boolean): void {
        const {project} = this;
        let url: string = `http://localhost:8080/${followed ? "unfollow" : "follow"}?token=${this.props.auth.token}&owner=${project.user}&repo=${project.name}`;
        const request = new Request(url);
        fetch(request).then(res => res.json())
            .then(unused => {
                project.follow = !followed;
                this.setState(this.state);
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
