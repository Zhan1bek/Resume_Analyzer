import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

function RecruiterApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [onlyMatchedSkills, setOnlyMatchedSkills] = useState(false);

    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        if (role !== 'recruiter' && role !== 'admin') {
            alert("Нет доступа");
            return;
        }
        fetchApplications();
        fetchJobs();
        // eslint-disable-next-line
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/recruiter/applications/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(res.data);
        } catch (error) {
            console.error(error);
            alert("Ошибка при получении откликов");
        }
    };

    const fetchJobs = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/jobs/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredApplications = applications.filter(app => {
        const foundSkills = app.analysis?.found_skills || [];
        const requiredSkills = app.required_skills || [];
        const matchedSkills = requiredSkills.filter(skill => foundSkills.includes(skill));

        const matchesJob = selectedJobId ? app.job_id === parseInt(selectedJobId) : true;
        const matchesSkills = onlyMatchedSkills ? matchedSkills.length > 0 : true;

        return matchesJob && matchesSkills;
    });

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-4">📬 Отклики на вакансии</h1>
                <p className="text-center text-gray-600">Просматривайте отклики соискателей и сравнивайте навыки</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="border border-blue-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Все вакансии</option>
                    {jobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                </select>

                <label className="flex items-center gap-2 text-blue-700">
                    <input
                        type="checkbox"
                        checked={onlyMatchedSkills}
                        onChange={(e) => setOnlyMatchedSkills(e.target.checked)}
                        className="accent-blue-600"
                    />
                    Только с совпавшими навыками
                </label>
            </div>

            <div className="grid gap-6">
                {filteredApplications.map(app => {
                    const foundSkills = app.analysis?.found_skills || [];
                    const requiredSkills = app.required_skills || [];
                    const matchedSkills = requiredSkills.filter(skill => foundSkills.includes(skill));

                    return (
                        <div key={app.application_id} className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300">
                            <h2 className="text-xl font-bold text-blue-700 mb-1">{app.job_title}</h2>
                            <p className="text-sm text-gray-600 mb-1">👤 <b>{app.username}</b> (ID: {app.user_id})</p>
                            <p className="text-sm text-gray-500">🕒 {new Date(app.application_date).toLocaleString()}</p>
                            <hr className="my-4" />

                            <p className="text-sm text-blue-700 font-medium">🔧 Требуемые навыки:</p>
                            <div className="text-sm text-gray-800 mb-2">{requiredSkills.join(', ')}</div>

                            {app.analysis ? (
                                <div className="text-sm space-y-1">
                                    <p><span className="font-semibold text-gray-700">✅ Найденные:</span> {foundSkills.join(', ')}</p>
                                    <p><span className="font-semibold text-red-500">❌ Пробелы:</span> {app.analysis.missing_skills?.join(', ')}</p>
                                    <p><span className="font-semibold text-green-600">🎯 Совпадения:</span> {matchedSkills.length > 0 ? matchedSkills.join(', ') : 'Нет совпадений'}</p>
                                </div>
                            ) : (
                                <p className="text-red-600 text-sm font-medium">⛔ Анализ резюме не найден</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
}

export default RecruiterApplicationsPage;
