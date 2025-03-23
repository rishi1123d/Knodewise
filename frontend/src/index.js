import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GradesPage from './GradesPage';
import KnowledgeTree from './kg';
// import './kg.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GradesPage />} />
        <Route path="/knowledge-map" element={<KnowledgeTree />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
); 