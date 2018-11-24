import * as React from 'react';
import {Issue, Project} from "../GithubProject";
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';

interface ProjectProfileProps {

}

@observer
class ProjectProfile extends React.Component<ProjectProfileProps, {}> {

    @observable private _project: Project = new Project("dottyProjectId", "lampepfl", "dotty", "Research compiler that will become Scala 3 ", ["scala", "scala3","epfl", "language-server-protocol", "compiler"], [new Issue("2543", "Require `case` prefix for patterns in for-comprehension generators")], false);
    @computed get project(): Project { return this._project; }
    set project(project: Project) { this._project = project; }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title"><a href={this.project.url()}> {this.project.getTitle()}</a></h1>
                    <button>Follow</button>
                </header>
                <div className="details">
                    <p className="description">
                        {this.project.description}
                    </p>
                    <p className="tags">
                        {this.project.printTags()}
                    </p>
                </div>
                <div className="issues">
                    <p>Issues:</p>
                    {this.createIssueList(this.project)}
                </div>
            </div>
        );
    }

    private createIssueList(project: Project) {
        return (
            <ul>
                {project.issues.map(function (issue: Issue) {
                    return <li><a href={issue.url(project.user, project.name)}>{issue.title}</a></li>;
                })}
            </ul>
        )
    }
}


export default ProjectProfile;
