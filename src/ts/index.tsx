import '../scss/base.scss';

import { createRoot } from 'react-dom/client';

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById('app'));
root.render(<h1>React Has Loaded!</h1>)
