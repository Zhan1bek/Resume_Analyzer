import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AnalysisPage() {
    const [analysisList, setAnalysisList] = useState([]);
    const token = localStorage.getItem('access_token');

    const fetchAnalysis = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/analysis/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAnalysisList(response.data);
        } catch (error) {
            console.error(error);
            alert("Ошибка при загрузке результатов анализа");
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-10">
                📊 Результаты AI-Анализа Резюме
            </h1>

            {analysisList.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">Нет доступных результатов анализа</p>
            ) : (
                analysisList.map(item => (
                    <div
                        key={item._id}
                        className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-6 mb-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        <p className="text-sm text-blue-500 mb-2"><b>ID:</b> {item._id}</p>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-lg font-semibold text-blue-800 mb-1">✅ Найденные навыки:</p>
                                <p className="text-gray-800 text-sm">{item.found_skills?.join(', ') || '—'}</p>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-red-600 mb-1">❌ Пропущенные навыки:</p>
                                <p className="text-gray-800 text-sm">{item.missing_skills?.join(', ') || '—'}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-lg font-semibold text-yellow-600 mb-1">⚠️ ATS-ключевые слова:</p>
                                <p className="text-gray-800 text-sm">{item.missing_ats_keywords?.join(', ') || '—'}</p>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-blue-700 mb-1">📄 Форматирование:</p>
                                <p className="text-gray-800 text-sm">{item.formatting_suggestions?.join('; ') || '—'}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-lg font-semibold text-purple-700">⭐ Рейтинг:</p>
                            <div className="text-2xl text-purple-900 font-bold">{item.rating} / 5</div>
                        </div>

                        <div className="mb-4">
                            <p className="text-lg font-semibold text-green-700 mb-2">💡 Рекомендации:</p>
                            <ul className="list-disc list-inside text-gray-800 text-sm space-y-1">
                                {item.recommendations?.map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                )) || '—'}
                            </ul>
                        </div>

                        <details className="mt-4 text-sm text-blue-600">
                            <summary className="cursor-pointer hover:underline font-medium">
                                📑 Показать фрагмент исходного текста
                            </summary>
                            <p className="mt-2 text-gray-700">{item.raw_text_excerpt}</p>
                        </details>
                    </div>
                ))
            )}
        </div>
    );
}

export default AnalysisPage;
