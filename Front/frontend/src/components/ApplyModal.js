import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ApplyModal({ job, onClose }) {
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        fetchResumes();
        // eslint-disable-next-line
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/my-resumes/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setResumes(response.data);
        } catch (error) {
            console.error(error);
            alert('Ошибка при загрузке списка резюме');
        }
    };

    const handleApply = async () => {
        if (!selectedResumeId) {
            alert("Выберите резюме");
            return;
        }
        try {
            await axios.post('http://127.0.0.1:8000/api/apply/',
                { job_id: job.id, resume_file_id: selectedResumeId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Резюме отправлено!");
            onClose();
        } catch (error) {
            console.error(error);
            alert("Ошибка при отправке резюме");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-2xl w-full max-w-md px-8 py-6 relative animate-fade-in">
                <button
                    className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl"
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    ×
                </button>

                <h2 className="text-2xl font-extrabold text-blue-800 mb-4 text-center">
                    Отправка резюме
                </h2>

                <p className="text-sm text-center text-gray-600 mb-6">
                    Вакансия: <strong>{job.title}</strong>
                </p>

                <label className="block mb-2 font-medium text-blue-700">Выберите резюме:</label>
                <select
                    className="w-full border border-blue-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                >
                    <option value="">-- Выберите --</option>
                    {resumes.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                            Резюме #{resume.id} ({resume.file})
                        </option>
                    ))}
                </select>

                <button
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 shadow"
                    onClick={handleApply}
                >
                    Отправить резюме
                </button>
            </div>
        </div>
    );
}

export default ApplyModal;
