import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);

const BASE_URL = "https://seng365.csse.canterbury.ac.nz/api/v1";

export {BASE_URL};
