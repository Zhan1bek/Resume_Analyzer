import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Layout({ children }) {
    const navigate = useNavigate();

    const accessToken = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-[#f0f4ff] to-[#e3e9ff]">
            {/* Header */}
            <header className="backdrop-blur-xl bg-white/30 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <Link
                        to="/"
                        className="text-2xl font-extrabold tracking-tight text-blue-700 hover:text-indigo-600 transition"
                    >
                        AI Resume Analyzer
                    </Link>
                    <nav className="flex gap-6 text-sm font-medium text-blue-700">
                        <Link to="/jobs" className="hover:text-indigo-600 transition">Jobs</Link>
                        {role === "recruiter" && (
                            <Link to="/recruiter-applications" className="hover:text-indigo-600 transition">
                                Мои отклики
                            </Link>
                        )}
                        <Link to="/upload-resume" className="hover:text-indigo-600 transition">Upload</Link>
                        <Link to="/analysis" className="hover:text-indigo-600 transition">Analysis</Link>
                        {accessToken ? (
                            <button
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-600 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-indigo-600 transition">Login</Link>
                                <Link to="/register" className="hover:text-indigo-600 transition">Register</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main */}
            <main className="flex-grow px-6 py-10">{children}</main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white text-sm text-center py-4">
                © {new Date().getFullYear()} <strong>AI-Powered Resume Analyzer</strong>. Все права защищены.
            </footer>
        </div>
    );
}

export default Layout;
