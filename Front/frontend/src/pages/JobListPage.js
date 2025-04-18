// src/pages/JobListPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import ApplyModal from '../components/ApplyModal';

function JobListPage() {
    const [jobs, setJobs] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/jobs/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(response.data);
        } catch (error) {
            console.error(error);
            alert('Ошибка при получении списка вакансий');
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/jobs/', {
                title,
                description,
                location,
                company_name: companyName,
                required_skills: requiredSkills.split(',').map(s => s.trim())
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Вакансия создана!');
            fetchJobs();
        } catch (error) {
            console.error(error);
            alert('Ошибка при создании вакансии');
        }
    };

    const openApplyModal = (job) => {
        setSelectedJob(job);
        setShowApplyModal(true);
    };

    const closeApplyModal = () => {
        setShowApplyModal(false);
        setSelectedJob(null);
    };

    return (
        <Layout>
            <h1 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                🌟 Текущие вакансии
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        className="bg-gradient-to-br from-white via-blue-50 to-purple-100 p-6 rounded-2xl border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <h2 className="text-2xl font-bold text-blue-800 mb-2">🚀 {job.title}</h2>
                        <p className="text-gray-700 italic mb-1">{job.description}</p>
                        <p className="text-sm text-gray-600">📍 <b>Локация:</b> {job.location}</p>
                        <p className="text-sm text-gray-600">🏢 <b>Компания:</b> {job.company_name}</p>

                        {job.required_skills?.length > 0 && (
                            <div className="mt-3">
                                <p className="text-blue-700 font-medium mb-1">🛠️ Навыки:</p>
                                <div className="flex flex-wrap gap-2">
                                    {job.required_skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-sm hover:scale-105 transition"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {role === 'jobseeker' && (
                            <div className="mt-4">
                                <button
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:brightness-110 transition"
                                    onClick={() => openApplyModal(job)}
                                >
                                    📩 Отправить резюме
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {role === 'recruiter' && (
                <div className="mt-16 bg-white p-8 rounded-xl border border-blue-200 shadow-2xl max-w-2xl mx-auto">
                    <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">📌 Новая вакансия</h2>
                    <form onSubmit={handleCreateJob} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Название"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            placeholder="Описание"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Локация"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Название компании"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Требуемые навыки (через запятую)"
                            value={requiredSkills}
                            onChange={(e) => setRequiredSkills(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold hover:brightness-110 transition"
                        >
                            ✅ Создать вакансию
                        </button>
                    </form>
                </div>
            )}

            {showApplyModal && selectedJob && (
                <ApplyModal
                    job={selectedJob}
                    onClose={closeApplyModal}
                />
            )}
        </Layout>
    );
}

export default JobListPage;
