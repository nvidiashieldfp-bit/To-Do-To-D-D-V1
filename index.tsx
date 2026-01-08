/**
 * ============================================================================
 * FILE: index.tsx
 * PURPOSE: Application bootstrap and React DOM mounting.
 * RESPONSIBILITY: Initializes the React application tree and mounts it to the DOM.
 * DEPENDENCIES: React, ReactDOM, App component.
 * ============================================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Locate the root DOM element defined in index.html.
 * This is the insertion point for the entire React component hierarchy.
 */
const rootElement = document.getElementById('root');

/**
 * Error boundary check: Ensure the root element exists before attempting to mount.
 * Prevents silent failures during the initialization phase.
 */
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

/**
 * Create a React root and render the application within StrictMode.
 * StrictMode is used to highlight potential problems in the application during development.
 */
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
