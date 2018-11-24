/* tslint:disable */
import * as React from "react";
import { Project } from 'src/GithubProject';
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
                        <ListItem button={true} onClick={(e) => routing.push(`/project?${project.id}`)}>
                            <ListItemText inset={true} primary={project.name} />
                        </ListItem>
                    ))
                }
            </List>
        );
    }
}

export default ProjectList;