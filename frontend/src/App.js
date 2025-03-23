import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import HomeScreen from './home';
import TeacherLogin from './teacherlogin';
import TeacherDashboard from './TeacherDashboard';
import GradesPage from './GradesPage';
import KnowledgeTree from './kg';
import AiTutor from './AiTutor';
import KnowledgeGraphCreator from './knowledgegraphcreator';
import './styles.css';

// Layout component to handle nested routes with the sidebar
const TeacherLayout = () => {
  return <TeacherDashboard><Outlet /></TeacherDashboard>;
};

// Simple student layout
const StudentLayout = () => {
  return (
    <div className="student-dashboard">
      <div className="student-sidebar">
        <h1>Canvas</h1>
        <p>Student Portal</p>
        {/* Student navigation would go here */}
      </div>
      <div className="student-content">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Home/Welcome Screen */}
      <Route path="/" element={<HomeScreen />} />
      
      {/* Teacher Login */}
      <Route path="/teacher/login" element={<TeacherLogin />} />
      
      {/* Teacher Routes with Dashboard Layout */}
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route path="dashboard" element={<div>Teacher Dashboard Home</div>} />
        <Route path="courses" element={<div>Courses Management</div>} />
        <Route path="assignments" element={<div>Assignments</div>} />
        <Route path="students" element={<div>Students</div>} />
        <Route path="knowledge-graph" element={<KnowledgeGraphCreator />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="ai-tutor" element={<AiTutor />} />
        <Route path="announcements" element={<div>Announcements</div>} />
        <Route path="settings" element={<div>Settings</div>} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      
      {/* Student Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<div>Student Dashboard Home</div>} />
        <Route path="courses" element={<div>My Courses</div>} />
        <Route path="assignments" element={<div>My Assignments</div>} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="knowledge-map" element={<KnowledgeTree />} />
        <Route path="ai-tutor" element={<AiTutor />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      
      {/* Redirect any unmatched routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;