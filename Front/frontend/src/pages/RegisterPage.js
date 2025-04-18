// src/pages/RegisterPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('jobseeker');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', {
        username, email, password, role
      });
      alert("🎉 Регистрация успешна!");
      navigate('/login');
    } catch (error) {
      alert("❌ Ошибка при регистрации");
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10 border-t-8 border-blue-500">
          <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
            ✨ Создать аккаунт
          </h2>
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-blue-700 mb-1">
                👤 Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Введите имя"
                required
                className="w-full px-4 py-2 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-700 mb-1">
                📧 Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Введите email"
                required
                className="w-full px-4 py-2 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-700 mb-1">
                🎭 Роль
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-4 py-2 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="jobseeker">Ищу работу</option>
                <option value="recruiter">Работодатель</option>
                <option value="admin">Админ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-700 mb-1">
                🔒 Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                className="w-full px-4 py-2 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl font-bold text-lg hover:opacity-90 transition duration-300 shadow-lg"
            >
              🚀 Зарегистрироваться
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default RegisterPage;
