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
import ComponentContainer from 'src/Utils/ComponentContainer';
import Typography from "@material-ui/core/es/Typography/Typography";

const styles = () => createStyles({
    spinnerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
        const { auth } = this.props;
        // Do the request for the followed and recommended projects
        this.fetchData();
        window.setInterval(() => auth.getNotification(auth.token), 10000);
    }

    private fetchData() {
        const { auth, timeline } = this.props;
        timeline.waiting = true;
        const request = new Request(`http://localhost:8080/timeline?token=${auth.token}`);
        fetch(request).then(res => res.json())
        .then(res => {
            console.log('Success:', JSON.stringify(res));
            timeline.followedProjects = res.followed_projects.map(Project.fromJson);
            timeline.recommendedProjects = res.recommended_projects.map(Project.fromJson);
            timeline.waiting = false;
        })
        .catch(err => {
            console.error("Error:", err);
            timeline.waiting = false;
        });
    }
    
    public render() {
        const { auth, classes, timeline, routing } = this.props;
        const { followedProjects, recommendedProjects } = timeline;
        if (timeline.waiting) {
            return (
                <div className={classes.spinnerContainer}>
                    <CircularProgress />
                </div>
            );
        }
        return (
            <ComponentContainer auth={auth} barTitle="Timeline" back={false} routing={routing} buttonText="Profile" buttonVariant="contained" buttonCallback={() => routing.push("profile")}>
                {followedProjects.length != 0 && (<div>
                    <Typography variant="h4">Followed Projects</Typography>
                    <ProjectList projects={followedProjects} routing={routing} />
                </div>)}

                {recommendedProjects.length != 0 && (<div>
                    <Typography variant="h4">Recommended Projects</Typography>
                    <ProjectList projects={recommendedProjects} routing={routing} />
                </div>)}

                {recommendedProjects.length == 0 && followedProjects.length == 0  && (
                    <Typography variant="h5">Update your profile to get project recommendations.</Typography>
                )}

            </ComponentContainer>
        );
    }
}

export default withStyles(styles)(Timeline);