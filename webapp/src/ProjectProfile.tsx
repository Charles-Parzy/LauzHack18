import * as React from 'react';
import './App.css';
import {Issue, Project} from "./GithubProject";

class ProjectProfile extends React.Component {


    public render() {
        let project: Project = new Project("dottyProjectId", "lampepfl", "dotty", "Research compiler that will become Scala 3 ", ["scala", "scala3","epfl", "language-server-protocol", "compiler"], [new Issue("2543", "Require `case` prefix for patterns in for-comprehension generators")], false);


        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title"><a href={project.url()}> {project.getTitle()}</a></h1>
                    <button>Follow</button>
                </header>
                <div className="details">
                    <p className="description">
                        {project.description}
                    </p>
                    <p className="tags">
                        {project.printTags()}
                    </p>
                </div>
                <div className="issues">
                    <p>Issues:</p>
                    {this.createIssueList(project)}
                </div>
            </div>
        );
    }

    createIssueList(project: Project) {
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
