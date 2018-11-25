/* tslint:disable */
import * as React from "react";
import { Project } from '../GithubProject';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { RouterStore } from 'mobx-react-router';

interface ProjectListProps {
    projects: Project[];
    routing: RouterStore;
}

class ProjectList extends React.Component<ProjectListProps, {}> {
    public render() {
        const { projects, routing } = this.props;
        const displayProjects: boolean = !!projects && !!projects.length;
        return (
            <List>
                {
                    displayProjects && projects.map((project) => (
                        <ListItem key={project.fullname} button={true} onClick={(e) => routing.push(`/project?owner=${project.owner}&repo=${project.repo}`)}>
                            <ListItemText primary={project.repo} secondary={project.description} />
                        </ListItem>
                    ))
                }
            </List>
        );
    }
}

export default ProjectList;