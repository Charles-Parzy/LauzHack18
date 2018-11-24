/* tslint:disable */
import * as React from "react";
import { inject, observer } from 'mobx-react';

interface TimelineProps {

}

@observer @inject("auth", "routing")
class Timeline extends React.Component<TimelineProps, {}> {

    
    
    public render() {
        return (
            <div>
                <div>
                    <h1>Followed Projects</h1>

                </div>

                <div>
                    <h1>Recommended Projects</h1>

                </div>

            </div>
        );
    }
}

export default Timeline;