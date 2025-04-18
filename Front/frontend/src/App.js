// src/App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListPage from './pages/JobListPage';
import UploadResumePage from './pages/UploadResumePage';
import AnalysisPage from './pages/AnalysisPage';
import './index.css';
import RecruiterApplicationsPage from "./pages/RecruiterApplicationsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/jobs" element={<JobListPage />} />
                <Route path="/upload-resume" element={<UploadResumePage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/recruiter-applications" element={<RecruiterApplicationsPage />} />
            </Routes>
        </Router>
    );
}

export default App;
