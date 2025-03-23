import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const TeacherLogin = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Simulate Google auth
    setTimeout(() => {
      navigate('/teacher/dashboard');
    }, 1000);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1 className="login-title">Teacher Login</h1>
        <p className="login-subtitle">Sign in to access your canvas dashboard</p>
        
        <button 
          className="google-sign-in-button"
          onClick={handleGoogleLogin}
        >
          <svg className="google-logo" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 11v2h2v2h-2v2h-2v-2H8v-2h2v-2h2zm0-9c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            />
          </svg>
          Sign in with Google
        </button>
        
        <p className="security-text">Secure authentication powered by Google</p>
      </div>
    </div>
  );
};

export default TeacherLogin;