<<<<<<< HEAD
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import Expance from '@/components/Expance'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
  Label,
  LineChart,
  Legend,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  BarChart,
} from "recharts";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";

const COLORS_INCOME = ["#00C49F", "#2F49D1", "#FFA500"];
const COLORS_EXPENSE = ["#FF8042", "#8884d8", "#82ca9d"];

const monthNames = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type ChartDataItem = {
  name: string;
  value: number;
  percentage?: number;
};

interface Programmer {
  id: number;
  first_name: string;
  last_name: string;
  image: string;
}

interface Project {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  programmers: Programmer[];
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  image: string;
  phone_number: string;
  position: string;
  date_of_jobstarted: string;
  salary: number;
}

export default function DashboardCharts() {
  const { data: session } = useSession();

  // Charts states
  const [pieData, setPieData] = useState<ChartDataItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pieLoading, setPieLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");

  const [lineData, setLineData] = useState<any[]>([]);
  const [lineLoading, setLineLoading] = useState(true);
  const [activeLineTab, setActiveLineTab] = useState<"year" | "month">("year");

  const [projectStatusData, setProjectStatusData] = useState<ChartDataItem[]>(
    []
  );
  const [projectsDoneData, setProjectsDoneData] = useState<ChartDataItem[]>([]);
  const [additionalLoading, setAdditionalLoading] = useState({
    status: true,
    done: true,
  });

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Employees state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  const fetchProjects = async () => {
    if (!session?.accessToken) return;

    try {
      setProjectsLoading(true);
      const res = await fetch(`https://crmm.repid.uz/employee/projects`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setProjects(data.items.slice(0, 3));
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    if (!session?.accessToken) return;

    try {
      setEmployeesLoading(true);
      const res = await fetch(`https://crmm.repid.uz/employee?page=1`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setEmployees(data.items || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const fetchPieData = async () => {
    if (!session?.accessToken) return;

    setPieLoading(true);

    const url =
      activeTab === "income"
        ? "https://crmm.repid.uz/income/pie-chart"
        : "https://crmm.repid.uz/expence/pie-chart";

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      const result = await res.json();

      const dataFormatted = [
        {
          name: "O'quvchilardan",
          value:
            result.total_income_student ?? result.total_expense_student ?? 0,
          percentage:
            result.percentage_income_student ??
            result.percentage_expense_student ??
            0,
        },
        {
          name: "Proektlardan",
          value:
            result.total_income_project ?? result.total_expense_project ?? 0,
          percentage:
            result.percentage_income_project ??
            result.percentage_expense_project ??
            0,
        },
        {
          name: "Investordan",
          value: result.total_investor ?? result.total_expense_investor ?? 0,
          percentage:
            result.percentage_income_investor ??
            result.percentage_expense_investor ??
            0,
        },
      ];

      const totalSum =
        result.total_income ?? result.total_expense ?? result.total ?? 0;
      setPieData(dataFormatted);
      setTotal(totalSum);
    } catch (error) {
      console.error("PieChart ma'lumotlarini yuklashda xato:", error);
    } finally {
      setPieLoading(false);
    }
  };

  const fetchLineData = async () => {
    if (!session?.accessToken) return;

    setLineLoading(true);

    const baseUrl = activeTab === "income" ? "income" : "expence";
    const url =
      activeLineTab === "year"
        ? `https://crmm.repid.uz/${baseUrl}/line-graph-year?year=2025`
        : `https://crmm.repid.uz/${baseUrl}/line-graph-month?year=2025&month=5`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      const result = await res.json();

      const formatted = Object.entries(result).map(([key, value]) => ({
        label:
          activeLineTab === "year" ? monthNames[Number(key) - 1] || key : key,
        value: value ?? 0,
      }));

      setLineData(formatted);
    } catch (error) {
      console.error("LineGraph ma'lumotlarini yuklashda xato:", error);
    } finally {
      setLineLoading(false);
    }
  };

  const fetchAdditionalData = async () => {
    if (!session?.accessToken) return;

    setAdditionalLoading({ status: true, done: true });

    try {
      const statusRes = await fetch(
        "https://crmm.repid.uz/expence/project-status-pie-chart",
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        const formattedStatusData = Object.entries(statusData).map(
          ([name, value]) => ({
            name,
            value: Number(value) || 0,
          })
        );
        setProjectStatusData(formattedStatusData);
      }

      const doneRes = await fetch(
        "https://crmm.repid.uz/expence/projects-done-bar-chart?year=2025",
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (doneRes.ok) {
        const doneData = await doneRes.json();
        const formattedDoneData = shortMonthNames.map((month, index) => ({
          name: month,
          value: doneData[index + 1] || 0,
        }));
        setProjectsDoneData(formattedDoneData);
      }
    } catch (error) {
      console.error("Additional charts data loading error:", error);
    } finally {
      setAdditionalLoading({ status: false, done: false });
    }
  };

  useEffect(() => {
    fetchPieData();
    fetchLineData();
    fetchAdditionalData();
    fetchProjects();
    fetchEmployees();
  }, [session, activeTab, activeLineTab]);

  if (
    pieLoading ||
    lineLoading ||
    additionalLoading.status ||
    additionalLoading.done ||
    projectsLoading ||
    employeesLoading
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const pieColors = activeTab === "income" ? COLORS_INCOME : COLORS_EXPENSE;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 mt-24">
        <p className="text-xl font-semibold">Dashboard</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("income")}
          className={`px-5 py-2 rounded-full ${
            activeTab === "income"
              ? "bg-[#F48C06] text-white"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          Kirim
        </button>
        <button
          onClick={() => setActiveTab("expense")}
          className={`px-5 py-2 rounded-full ${
            activeTab === "expense"
              ? "bg-[#F48C06] text-white"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          Chiqim
        </button>
      </div>

      <section className="bg-white rounded-xl p-6 shadow-md mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === "income" ? "Kirimlar" : "Chiqimlar"} bo'yicha grafik
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveLineTab("year")}
              className={`px-4 py-2 rounded ${
                activeLineTab === "year"
                  ? "bg-[#F48C06] text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              Yiliga
            </button>
            <button
              onClick={() => setActiveLineTab("month")}
              className={`px-4 py-2 rounded ${
                activeLineTab === "month"
                  ? "bg-[#F48C06] text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              Oylik
            </button>
          </div>
        </div>
        <div className="h-[500px] lg:w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} tickMargin={10} />
              <YAxis
                width={40}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${value / 1000000}M`;
                  if (value >= 1000) return `${value / 1000}K`;
                  return value;
                }}
              />
              <RechartsTooltip
                formatter={(value) => [
                  `${value.toLocaleString()} UZS`,
                  "Summa",
                ]}
                labelFormatter={(label) => `Oy: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Summa"
                stroke="#F48C06"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-md flex flex-col md:flex-row items-center md:items-start mb-10">
        <div className="w-full md:w-2/3 h-[450px]">
          <h3 className="text-center text-lg font-semibold mb-4">
            {activeTab === "income" ? "Tushumlar" : "Chiqimlar"}
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={160}
                fill="#8884d8"
                label={({ name, value, percentage }) =>
                  `${name}: ${value.toLocaleString()} (${
                    percentage?.toFixed(1) ?? 0
                  }%)`
                }
                labelLine={true}
                stroke="#fff"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
                <Label
                  value={total.toLocaleString()}
                  position="center"
                  fontSize={20}
                  fontWeight="bold"
                  fill="#000"
                />
              </Pie>
              <PieTooltip
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} so'm`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/3 mt-42 md:ml-10">
          <h4 className="text-lg font-semibold mb-3">Foizdagi ulushlar</h4>
          <ul>
            {pieData.map((item, index) => (
              <li
                key={item.name}
                className="flex justify-between items-center mb-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded"
                    style={{
                      backgroundColor: pieColors[index % pieColors.length],
                    }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">
                  {item.percentage?.toFixed(1) ?? 0}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-md flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">
              Bajarilgan proektlar
            </h3>
            <span className="text-sm text-gray-400">2025</span>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectsDoneData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <RechartsTooltip
                  formatter={(value) => [`projects : ${value}`, ""]}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    borderRadius: "6px",
                    border: "none",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                  {projectsDoneData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value > 0 ? "#FFA500" : "#D3D3D3"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md w-full lg:w-96">
          <h3 className="font-semibold text-gray-800 text-center mb-6">
            Umumiy proektlar
          </h3>
          <div className="relative h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={130}
                  labelLine={false}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "count_done_project"
                          ? "#FFA500"
                          : "#D3D3D3"
                      }
                    />
                  ))}
                </Pie>

                {/* Вот тут добавляем тултип */}
                <PieTooltip
                  formatter={(value, name) => [
                    `${value}`,
                    name === "count_done_project" ? "Tugallangan" : "Jarayonda",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-semibold text-gray-700">
              {projectStatusData.reduce((acc, cur) => acc + cur.value, 0)}
            </div>
          </div>
          <div className="flex justify-around mt-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#FFA500]"></span>
              Tugallangan loyihalar
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#D3D3D3]"></span>
              Jarayondagi loyihalar
            </div>
          </div>
        </div>
      </div>
      <section className="bg-white rounded-xl p-6 shadow-md mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Oxirgi loyihalar
        </h2>
        <div className="grid gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative w-full bg-white rounded-[16px] overflow-hidden shadow-sm border border-gray-200 p-6"
            >
              <div className="flex flex-col md:flex-row w-full">
                <div className="w-full md:w-1/2 mb-4 md:mb-0 md:pr-6">
                  <div className="flex items-center gap-[18px] mb-[15px]">
                    <div>
                      <span className="text-[#91929E] text-sm">
                        Loyiha nomi
                      </span>
                      <p className="text-[#0A1629] text-[18px] md:text-[20px] font-semibold line-clamp-1">
                        {project.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#7D8592] text-sm md:text-base flex gap-3">
                      <Calendar size={18} />
                      {dayjs(project.start_date).format("YYYY-MM-DD")}
                    </span>
                    <span className="text-[#7D8592] text-sm md:text-base flex gap-3">
                      <Calendar size={18} />
                      {dayjs(project.end_date).format("YYYY-MM-DD")}
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="flex items-start gap-[30px]">
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[#91929E] text-sm md:text-base">
                        Holati
                      </span>
                      <button
                        className={`text-sm py-0.5 border px-2 rounded mt-2 ${
                          project.status === "in_progres"
                            ? "text-[#FFA500] border-[#F48C05] bg-[#F48C05]/10"
                            : project.status === "done"
                            ? "text-[#00D388] border-[#00D388] bg-[#00D388]/10"
                            : "text-gray-600 border-gray-300 bg-gray-100"
                        }`}
                      >
                        {project.status === "in_progres"
                          ? "Jaroyonda"
                          : project.status === "done"
                          ? "Tugallangan"
                          : "Noma'lum"}
                      </button>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[#91929E] text-sm md:text-base">
                        Hodimlar
                      </span>
                      <div className="flex relative">
                        {project.programmers.map((prog, index) => (
                          <div
                            key={prog.id}
                            className={`relative group ${
                              index > 0 ? "-ml-3" : ""
                            }`}
                          >
                            <div className="rounded-full border-2 border-white flex items-center justify-center w-[40px] h-[40px] bg-gray-400 overflow-hidden hover:scale-105 transition">
                              {prog.image ? (
                                <img
                                  src={`https://crmm.repid.uz${prog.image}`}
                                  alt={`${prog.first_name} ${prog.last_name}`}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white">
                                  {prog.first_name.charAt(0)}
                                  {prog.last_name.charAt(0)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Expance/>
    </main>
  );
}
=======
'use client';

import React, { useState } from 'react';
import { Card, Input, InputNumber, DatePicker, Button, Alert, message } from 'antd';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { div } from 'framer-motion/client';

const CreateIncomeProject: React.FC = () => {
  const { data: session } = useSession();
  const [payPrice, setPayPrice] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [datePaid, setDatePaid] = useState<string>(new Date().toISOString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!session?.accessToken) {
      setError('Not authenticated');
      return;
    }

    if (!payPrice || !projectId || !description || !datePaid) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://crmm.repid.uz/income/project', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          pay_price: String(payPrice),
          project_id: projectId,
          description,
          date_paid: datePaid
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Error:', result);
        throw new Error(result?.detail || 'Failed to submit income');
      }

      message.success('Доход успешно создан!');
      // Очистка формы
      setPayPrice(null);
      setProjectId(0);
      setDescription('');
      setDatePaid(new Date().toISOString());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-24'>
    <Card title="Создание дохода проекта" style={{ maxWidth: 500, margin: 'auto' }}>
      {error && <Alert message="Ошибка" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <InputNumber
        value={payPrice ?? undefined}
        onChange={(value) => setPayPrice(value)}
        placeholder="Сумма (pay_price)"
        style={{ width: '100%', marginBottom: 16 }}
      />
      <InputNumber
        value={projectId}
        onChange={(value) => setProjectId(value || 0)}
        placeholder="ID проекта (project_id)"
        style={{ width: '100%', marginBottom: 16 }}
      />
      <Input.TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание"
        rows={3}
        style={{ marginBottom: 16 }}
      />
      <DatePicker
        style={{ width: '100%', marginBottom: 16 }}
        value={dayjs(datePaid)}
        onChange={(date) => setDatePaid(date?.toISOString() || new Date().toISOString())}
      />
      <Button type="primary" onClick={handleSubmit} loading={loading} block>
        Отправить
      </Button>
    </Card>
    </div>
  );
};

export default CreateIncomeProject;
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297
