// src/pages/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      if (response.data.user) {
        localStorage.setItem('role', response.data.user.role);
      }
      alert("Успешный вход!");
      navigate('/jobs');
    } catch (error) {
      alert("Ошибка входа");
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-20">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border-t-8 border-indigo-500">
          <h2 className="text-4xl font-bold text-center text-indigo-700 mb-8 tracking-tight">
            Вход в аккаунт
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-indigo-600 mb-1">
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Введите имя"
                required
                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-600 mb-1">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2 rounded-xl font-bold text-lg hover:opacity-90 transition duration-300 shadow-md"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;
