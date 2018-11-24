import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ProjectProfile from './ProjectProfile';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <ProjectProfile />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
