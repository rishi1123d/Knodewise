# KNODEWISE

A full-stack mathematics tutoring application with AI capabilities.

## Overview

KNODEWISE is an interactive learning platform designed to help students improve their mathematics skills through AI-powered tutoring. The application features voice recognition, personalized learning paths, and performance tracking.

## Tech Stack

### Backend
- Python
- Flask (implied by app.py structure)

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3

### Build Tools & Configuration
- Babel for JavaScript transpilation
- npm/Node.js for package management

## Project Structure

```
KNODEWISE/
├── backend/
│   ├── app.py                # Main Python application entry point
│   ├── math_voice_tutor.py   # Voice-enabled math tutoring functionality
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── node_modules/         # Node.js packages
│   ├── public/               # Static assets directory
│   │   └── index.html        # Main HTML entry point
│   └── src/                  # React source code
│       ├── assets/           # Images, fonts, and other static resources
│       ├── AITutor.jsx       # AI tutoring component
│       ├── App.js            # Main React application component
│       ├── GradesPage.jsx    # Student grades and progress tracking
│       ├── index.js          # JavaScript entry point
│       ├── kg.css            # Main stylesheet
│       └── kg.jsx            # Knowledge graph component
├── .babelrc                  # Babel configuration
├── .gitignore                # Git ignore configuration
├── LICENSE                   # Project license
├── jsconfig.json             # JavaScript configuration
├── package.json              # Node.js package configuration
└── package-lock.json         # Node.js package lock file
```

## Features

- **AI-Powered Tutoring**: Intelligent tutoring system that adapts to student needs
- **Voice Recognition**: Interact with the tutor using voice commands
- **Performance Tracking**: Monitor student progress through the GradesPage
- **Knowledge Graph**: Visualize mathematical concepts and their relationships

## Installation

### Prerequisites
- Python 3.7+
- Node.js 14+
- npm 6+

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Start the backend server:
   ```
   python app.py
   ```

### Frontend Setup
1. Navigate to the project root directory
2. Install Node.js dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Create an account or log in
3. Start interacting with the AI tutor
4. Track your progress in the Grades section

## Development

### Adding New Features
1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Implement your changes
3. Submit a pull request

### Running Tests
```
npm test
```

## License

This project is licensed under the terms found in the LICENSE file.

## Contact

For any inquiries, please reach out to the project maintainers.
