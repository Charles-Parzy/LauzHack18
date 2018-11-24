/* tslint:disable */
import * as React from "react";
import { inject, observer } from 'mobx-react';
import AuthenticationStore from 'src/Authentication/AuthenticationStore';
import { RouterStore } from 'mobx-react-router';
import TimelineStore from './TimelineStore';
import ProjectList from './ProjectList';

interface TimelineProps {
    auth: AuthenticationStore;
    routing: RouterStore;
    timeline: TimelineStore;
}

@inject("auth", "routing", "timeline") @observer
class Timeline extends React.Component<TimelineProps, {}> {

    componentWillMount() {
        // Do the request for the followed and recommended projects
    }
    
    public render() {
        const { timeline, routing } = this.props;
        const { followedProjects, recommendedProjects } = timeline;
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