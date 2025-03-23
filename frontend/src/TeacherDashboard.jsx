import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import GradesPage from './GradesPage';
import KnowledgeTree from './kg';
import AiTutor from './AiTutor';
import KnowledgeGraphCreator from './knowledgegraphcreator';
import './styles.css';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleNavigation = (path) => {
    navigate(`/teacher/${path}`);
  };

  // Dashboard stats
  const dashboardStats = {
    courses: 4,
    students: 128,
    pendingAssignments: 12
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Canvas</h1>
          <p className="sidebar-subtitle">Teacher Portal</p>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => handleNavigation('dashboard')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
              Dashboard
            </li>
            <li 
              className={activeTab === 'courses' ? 'active' : ''}
              onClick={() => handleNavigation('courses')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
              </svg>
              Courses
            </li>
            <li 
              className={activeTab === 'students' ? 'active' : ''}
              onClick={() => handleNavigation('students')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              Students
            </li>
            <li 
              className={activeTab === 'assignments' ? 'active' : ''}
              onClick={() => handleNavigation('assignments')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              Assignments
            </li>
            <li 
              className={activeTab === 'knowledge-graph' ? 'active' : ''}
              onClick={() => handleNavigation('knowledge-graph')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3h7zM7 9H4V5h3v4zm10 6h3v4h-3v-4zm0-10h3v4h-3V5z" />
              </svg>
              Knowledge Graph
            </li>
            <li 
              className={activeTab === 'settings' ? 'active' : ''}
              onClick={() => handleNavigation('settings')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
              Settings
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button 
            className="sign-out-button"
            onClick={() => navigate('/welcome')}
          >
            <svg className="sign-out-icon" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => handleTabChange('courses')}
            >
              Courses
            </button>
            <button 
              className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => handleTabChange('students')}
            >
              Students
            </button>
            <button 
              className={`tab-button ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => handleTabChange('assignments')}
            >
              Assignments
            </button>
            <button 
              className={`tab-button ${activeTab === 'knowledge-graph' ? 'active' : ''}`}
              onClick={() => handleTabChange('knowledge-graph')}
            >
              Knowledge Graph
            </button>
          </div>
          
          <div className="header-actions">
            <div className="search-box">
              <input type="text" placeholder="Search..." />
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
            
            <button className="notification-button">
              <svg className="notification-icon" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </button>
            
            <div className="user-profile">
              <div className="avatar">
                <img src="/api/placeholder/40/40" alt="Teacher" />
              </div>
              <div className="user-info">
                <div className="user-name">Teacher Name</div>
                <div className="user-role">Mathematics</div>
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'overview' && (
            <div className="dashboard-overview">
              <h1 className="page-title">Dashboard Overview</h1>
              
              <div className="stats-cards">
                <div className="stat-card">
                  <h3 className="stat-title">Active Courses</h3>
                  <div className="stat-value">{dashboardStats.courses}</div>
                </div>
                
                <div className="stat-card">
                  <h3 className="stat-title">Total Students</h3>
                  <div className="stat-value">{dashboardStats.students}</div>
                </div>
                
                <div className="stat-card">
                  <h3 className="stat-title">Pending Assignments</h3>
                  <div className="stat-value">{dashboardStats.pendingAssignments}</div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'knowledge-graph' && <KnowledgeGraphCreator />}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;