import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const HomeScreen = () => {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    navigate('/student/knowledge-map');
  };

  const handleTeacherLogin = () => {
    navigate('/teacher/login');
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to the new canvas</h1>
        <h2 className="welcome-subtitle">the new way of learning</h2>
        
        <div className="login-options">
          <button 
            className="login-button student-login"
            onClick={handleStudentLogin}
          >
            Student Login
            <span className="arrow-icon">→</span>
          </button>
          
          <button 
            className="login-button teacher-login"
            onClick={handleTeacherLogin}
          >
            Teacher Login
            <span className="arrow-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;