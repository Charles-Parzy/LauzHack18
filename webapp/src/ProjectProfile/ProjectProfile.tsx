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
                false),
        };
    }

    public render() {

        let project: Project = this.state.project;
        let follow: boolean = this.state.project.followed;

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

    updateFollow(follow: boolean) {
        this.state.project.follow = follow;
        this.setState(this.state);
    }

    createTagList(project: Project) {
        return (
            <div className="tags">
                {
                   project.tags.map(function (tag: string) {
                       return <span key={tag} className="tag-chip"><Button size="small" variant="outlined"href={"http://github.com/topics/"+tag}>{tag}</Button></span>
                   })
                }
                </div>
        )
    }

    createIssueList(project: Project) {
        return (
            <List>
                {project.issues.map(function (issue: Issue, index: number) {
                    return <ListItem key={index} button component="a" href={issue.url(project.user, project.name)}><ListItemText primary={issue.title} secondary={issue.subtext} /></ListItem>;
                })}
            </List>
        )
    }
}


export default ProjectProfile;
