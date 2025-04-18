import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

function UploadResumePage() {
  const [file, setFile] = useState(null);
  const token = localStorage.getItem('access_token');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/upload-resume/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Ошибка при загрузке');
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <h1 className="text-3xl font-extrabold text-blue-800 text-center mb-6">
            Загрузка резюме
          </h1>

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Выберите файл
              </label>
              <input
                className="w-full border border-blue-300 rounded-lg px-3 py-2 file:bg-blue-600 file:text-white file:rounded file:border-none file:px-5 file:py-2 file:cursor-pointer hover:file:bg-blue-700 transition"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-lg shadow hover:shadow-md hover:from-blue-600 hover:to-blue-800 transition"
            >
              Загрузить
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default UploadResumePage;
