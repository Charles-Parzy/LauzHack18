import * as React from 'react';
import './ProjectProfile.css';
import {Issue, Project} from "./GithubProject";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

interface ProjectProfileState {
    project: Project;
}

interface ProjectProfileProps {

}

class ProjectProfile extends React.Component<ProjectProfileProps, ProjectProfileState> {

    constructor(props: ProjectProfileProps) {
        super(props);
        this.state = {
            project: new Project(
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
                false),
        };
    }

    public render() {

        let project: Project = this.state.project;
        let follow: boolean = this.state.project.followed;

        return (
            <div className="App">
                <div>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Typography variant="h6" className="grow">
                                Repository
                            </Typography>
                            <div><Button variant={follow ? "outlined" : "contained"} color="primary"
                                         onClick={() => this.updateFollow(!project.followed)}>{project.printFollow()}</Button>
                            </div>
                        </Toolbar>
                    </AppBar>
                </div>
                <div>
                </div>
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

            </div>
        );
    }

    updateFollow(follow: boolean) {
        this.state.project.follow = follow;
        this.setState(this.state);
    }

    createTagList(project: Project) {
        return (
            <div className="tags">
                {
                   project.tags.map(function (tag: string) {
                       return <span className="tag-chip"><Button size="small" variant="outlined"href={"http://github.com/topics/"+tag}>{tag}</Button></span>
                   })
                }
                </div>
        )
    }

    createIssueList(project: Project) {
        return (
            <List>
                {project.issues.map(function (issue: Issue) {
                    return <ListItem  button component="a" href={issue.url(project.user, project.name)}><ListItemText primary={issue.title} secondary={issue.subtext} /></ListItem>;
                })}
            </List>
        )
    }
}


export default ProjectProfile;
