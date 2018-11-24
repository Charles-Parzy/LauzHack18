/* tslint:disable */
import * as React from "react";
import { inject, observer } from 'mobx-react';
import AuthenticationStore from 'src/Authentication/AuthenticationStore';
import { RouterStore } from 'mobx-react-router';
import TimelineStore from './TimelineStore';
import ProjectList from './ProjectList';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Project } from 'src/GithubProject';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';

const styles = () => createStyles({
    spinnerContainer: {
        position: "fixed", /* or absolute */
        top: "50%",
        left: "50%",
    }
});

interface TimelineProps extends WithStyles<typeof styles> {
    auth: AuthenticationStore;
    routing: RouterStore;
    timeline: TimelineStore;
}

@inject("auth", "routing", "timeline") @observer
class Timeline extends React.Component<TimelineProps, {}> {

    componentWillMount() {
        // Do the request for the followed and recommended projects
        this.fetchData();
    }

    private fetchData() {
        const { timeline } = this.props;
        timeline.waiting = true;
        const request = new Request("http://localhost:8080/timeline?languages=java&topics=compiler&topics=java"); // TODO: fill the path of the request
        fetch(request).then(res => res.json())
        .then(res => {
            console.log('Success:', JSON.stringify(res));
            timeline.followedProjects = res.followed_projects.map((p: any) => new Project(p.id, "", p.name, p.description, [], [], false));
            timeline.recommendedProjects = res.recommended_projects.map((p: any) => new Project(p.id, "", p.name, p.description, [], [], false));
            timeline.waiting = false;
        })
        .catch(err => {
            console.error("Error:", err);
            timeline.waiting = false;
        });
    }
    
    public render() {
        const { classes, timeline, routing } = this.props;
        const { followedProjects, recommendedProjects } = timeline;
        if (timeline.waiting) {
            return (
                <div className={classes.spinnerContainer}>
                    <CircularProgress />
                </div>
            );
        }
        return (
            <div>
                <div>
                    <h1>Followed Projects</h1>
                    <ProjectList projects={followedProjects} routing={routing} />
                </div>

                <div>
                    <h1>Recommended Projects</h1>
                    <ProjectList projects={recommendedProjects} routing={routing} />
                </div>

            </div>
        );
    }
}

export default withStyles(styles)(Timeline);