// src/pages/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-blue-50 py-20 px-6 font-sans text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-3">JobMentor 🚀</h1>
        <p className="text-lg text-blue-700 mb-6">
          Платформа, где резюме становится историей успеха
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium shadow"
          >
            Регистрация
          </Link>
          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-100 transition font-medium"
          >
            Войти
          </Link>
        </div>
      </div>

      {/* Step-by-step Section */}
      <div className="bg-white px-6 py-20 font-sans">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-16">
          Как это работает
        </h2>

        <div className="max-w-4xl mx-auto space-y-16">
          {/* Step 1 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shadow">
              📍
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Анализ контекста
              </h3>
              <p className="text-blue-700 text-sm">
                Наш AI анализирует ваши навыки и подсказывает, каких знаний не хватает для желаемой должности.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shadow">
              🛠️
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Советы по оформлению
              </h3>
              <p className="text-blue-700 text-sm">
                Автоматические рекомендации по улучшению структуры и визуального стиля вашего резюме.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shadow">
              🏢
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Ключевые слова (ATS)
              </h3>
              <p className="text-blue-700 text-sm">
                Добавьте релевантные ключевые слова, чтобы пройти автоматические фильтры работодателей (ATS).
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
