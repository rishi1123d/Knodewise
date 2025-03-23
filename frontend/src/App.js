import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GradesPage from './GradesPage';
import KnowledgeTree from './kg';
import AiTutor from './AiTutor';
// In App.js or index.js
import './kg.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<GradesPage />} />
      <Route path="/knowledge-map" element={<KnowledgeTree />} />
      <Route path="/ai-tutor" element={<AiTutor />} />
    </Routes>
  );
}

export default App; 