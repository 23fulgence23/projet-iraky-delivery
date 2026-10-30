import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "./i18n";
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import "./responsive.css";
import "./DashboardTheme.css";
import "./utils/reseau";
try {
  document.documentElement.setAttribute("data-theme", localStorage.getItem("iraky-theme") === "light" ? "light" : "dark");
} catch {}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorkerRegistration.register();
