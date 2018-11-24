/* tslint:disable */
import * as React from "react";
import { inject, observer } from 'mobx-react';
import AuthenticationStore from 'src/Authentication/AuthenticationStore';
import { RouterStore } from 'mobx-react-router';
import TimelineStore from './TimelineStore';
import ProjectList from './ProjectList';
import CircularProgress from '@material-ui/core/CircularProgress';

interface TimelineProps {
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
        const { auth, timeline } = this.props;
        timeline.waiting = true;
        const headers = new Headers();
        headers.append("lauz-hack-token", auth.token);
        headers.append("Access-Control-Allow-Origin", "*");
        const request = new Request("", { headers: headers }); // TODO: fill the path of the request
        fetch(request).then(res => res.json())
        .then(res => {
            console.log('Success:', JSON.stringify(res));
            timeline.followedProjects = res.followed_projects;
            timeline.recommendedProjects = res.recommended_projects;
            timeline.waiting = false;
        })
        .catch(err => {
            console.error("Error:", err);
            timeline.waiting = false;
        });
    }
    
    public render() {
        const { timeline, routing } = this.props;
        const { followedProjects, recommendedProjects } = timeline;
        if (timeline.waiting) {
            return <CircularProgress />;
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

export default Timeline;