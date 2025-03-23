import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GradesPage from './GradesPage';
import KnowledgeTree from './student_kt';
import KnowledgeTree2 from './teacher_kt';
import AiTutor from './AiTutor';
// In App.js or index.js
import './kt.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<GradesPage />} />
      <Route path="/knowledge-map-student" element={<KnowledgeTree />} />
      <Route path="/knowledge-map-teacher" element={<KnowledgeTree2 />} />
      <Route path="/ai-tutor" element={<AiTutor />} />
    </Routes>
  );
}

export default App; 