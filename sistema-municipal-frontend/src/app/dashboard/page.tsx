"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api';

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/goals/stats').then((response) => {
      setData(response.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="progress" fill="#2563eb" />
      </BarChart>
    </div>
  );
}