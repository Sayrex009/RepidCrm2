"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function IncomePage() {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.accessToken) {
        console.error("Access token not found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://crmm.repid.uz/income/pie-chart", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-lg text-gray-600 animate-pulse">Yuklanmoqda...</p>
      </div>
    );
  }

  const chartData = Array.isArray(data)
    ? data.map((item: any) => ({ category: item.name, value: item.value }))
    : typeof data === "object"
    ? Object.keys(data).map((key) => ({
        category: `Kategoriya ${key}`,
        value: data[key],
      }))
    : [];

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Kirim va Chiqim Tahlili</h1>

      <div className="w-full h-[400px] bg-white rounded-2xl shadow-md p-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" barSize={30} fill="#8884d8" />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
