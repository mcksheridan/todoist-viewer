import * as React from "react";
import { createRoot } from "react-dom/client";
import Project from "./project";
import "../scss/base.scss";

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById("app"));

const App = () => <Project />;

root.render(<App />);
