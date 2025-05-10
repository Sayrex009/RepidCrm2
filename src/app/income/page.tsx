"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function IncomePage() {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Массив для цветов, чтобы разделить сегменты на графике
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.accessToken) {
        console.error("Access token not found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://crmm.repid.uz/income/pie-chart",
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        // Выводим результат, чтобы понять структуру данных
        console.log("Fetched data:", result);

        setData(result); // Получаем данные для круговой диаграммы
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) return <p>Yuklanmoqda...</p>;

  // Проверка и преобразование данных
  let pieData = [];

  // Если данные - это объект, преобразуем его в массив
  if (Array.isArray(data)) {
    pieData = data.map((item: any) => ({
      name: item.name,
      value: item.value,
    }));
  } else if (typeof data === "object") {
    // Если данные это объект с ключами, то преобразуем их в массив
    pieData = Object.keys(data).map((key) => ({
      name: `Category ${key}`, // Можно задать более осмысленные имена
      value: data[key],
    }));
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Kirim chiqim</h1>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
