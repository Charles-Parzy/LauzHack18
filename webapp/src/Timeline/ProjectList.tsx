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
                        <ListItem key={project.id} button={true} onClick={(e) => routing.push(`/project?owner=${project.user}&repo=${project.name}`)}>
                            <ListItemText primary={project.name} secondary={project.description} />
                        </ListItem>
                    ))
                }
            </List>
        );
    }
}

export default ProjectList;