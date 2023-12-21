import * as React from 'react';
import '../scss/base.scss';
import { createRoot } from 'react-dom/client';
import Project from './project';

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById('app'));

const App = () => <Project />

root.render(<App />);
