import React from 'react';
import ReactDOM from 'react-dom/client';
import KnowledgeTree from './kg';
import './kg.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <KnowledgeTree />
  </React.StrictMode>
); 