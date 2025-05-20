"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
<<<<<<< HEAD
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
  Label,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

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

type StudentInvestorItem = {
  id: number;
  name: string;
  real_price: string;
  pay_price: string;
  left_price: number;
  description: string;
  date_paied: string;
  position: string;
  type: string;
};

export default function DashboardCharts() {
  const { data: session } = useSession();

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

  const [studentInvestorData, setStudentInvestorData] = useState<
    StudentInvestorItem[]
  >([]);
  const [studentInvestorLoading, setStudentInvestorLoading] = useState(true);

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

  const fetchStudentInvestorData = async () => {
    if (!session?.accessToken) return;

    setStudentInvestorLoading(true);

    try {
      const params = new URLSearchParams({
        type: "1",
        page: "1",
        size: "50",
      });

      const res = await fetch(
        `https://crmm.repid.uz/income/student-investor?type=investor&page=1&size=50?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Error fetching student-investor data: ${res.status}`);
      }

      const result = await res.json();
      setStudentInvestorData(result.items || []);
    } catch (error) {
      console.error("Student investor data loading error:", error);
    } finally {
      setStudentInvestorLoading(false);
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
    fetchStudentInvestorData();
  }, [session, activeTab, activeLineTab]);

  if (
    pieLoading ||
    lineLoading ||
    additionalLoading.status ||
    additionalLoading.done ||
    studentInvestorLoading
  ) {
    return (
      <div className="justify-center items-center flex h-screen">
        <div className="spinner"></div>
=======
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
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297
      </div>
    );
  }

<<<<<<< HEAD
  const pieColors = activeTab === "income" ? COLORS_INCOME : COLORS_EXPENSE;

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Заголовок и общая сумма */}
      <div className="mt-24 mb-4">
        <h1 className="text-2xl font-bold">Kirimlar va chiqimlar</h1>
      </div>

      {/* Main Toggle */}
      <div className="flex gap-2 md:gap-4 mb-4 md:mb-6">
        <button
          onClick={() => setActiveTab("income")}
          className={`px-3 py-1 md:px-5 md:py-2 text-sm md:text-base rounded-full ${
            activeTab === "income"
              ? "bg-[#F48C06] text-white"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          Kirim
        </button>
        <button
          onClick={() => setActiveTab("expense")}
          className={`px-3 py-1 md:px-5 md:py-2 text-sm md:text-base rounded-full ${
            activeTab === "expense"
              ? "bg-[#F48C06] text-white"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          Chiqim
        </button>
      </div>

      {/* Line Chart Section */}
      <section className="bg-white rounded-xl p-4 md:p-6 shadow-md mb-6 md:mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {activeTab === "income" ? "Kirimlar" : "Chiqimlar"} bo'yicha grafik
          </h2>
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => setActiveLineTab("year")}
              className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full ${
                activeLineTab === "year"
                  ? "bg-[#F48C06] text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              Yiliga
            </button>
            <button
              onClick={() => setActiveLineTab("month")}
              className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full ${
                activeLineTab === "month"
                  ? "bg-[#F48C06] text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              Oylik
            </button>
          </div>
        </div>
        <div className="h-[300px] md:h-[400px] w-full">
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

      {/* Pie Chart Section */}
      <section className="bg-white rounded-xl p-4 md:p-6 shadow-md flex flex-col md:flex-row items-center md:items-start mb-6 md:mb-10">
        <div className="w-full md:w-2/3 h-[350px] md:h-[450px]">
          <h3 className="text-center text-md md:text-lg font-semibold mb-3 md:mb-4">
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
                innerRadius={70}
                outerRadius={130}
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
                  fontSize={16}
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

        <div className="w-full md:w-1/3 mt-4 md:mt-0 md:ml-6 lg:ml-10">
          <h4 className="text-md md:text-lg font-semibold mb-2 md:mb-3">
            Foizdagi ulushlar
          </h4>
          <ul className="space-y-2 md:space-y-3">
            {pieData.map((item, index) => (
              <li key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2 md:gap-3">
                  <div
                    className="w-4 h-4 md:w-5 md:h-5 rounded"
                    style={{
                      backgroundColor: pieColors[index % pieColors.length],
                    }}
                  />
                  <span className="text-sm md:text-base">{item.name}</span>
                </div>
                <span className="font-semibold text-sm md:text-base">
                  {item.percentage?.toFixed(1) ?? 0}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Project Charts */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        {/* График завершенных проектов */}
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

        {/* Круговая диаграмма статусов проектов */}
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

      {/* Student Investor Table */}
      <div className="flex flex-col gap-y-4 md:gap-y-5">
        {studentInvestorData.length === 0 ? (
          <p className="text-center text-gray-500">Ma'lumotlar mavjud emas.</p>
        ) : (
          studentInvestorData.map((item) => (
            <div
              key={item.id}
              className="relative w-full bg-white rounded-xl md:rounded-[24px] overflow-hidden shadow-sm"
            >
              <div className="flex flex-col md:flex-row w-full overflow-auto scrollbar-none">
                <div className="w-full xl:min-w-[470px] xl:max-w-[470px] md:min-w-[400px] md:max-w-[400px] border-b md:border-b-0 md:border-r border-[#E4E6E8] p-4 md:p-6">
                  <div className="mb-3 md:mb-4">
                    <span className="text-[#91929E] text-xs md:text-sm">
                      F.I.SH
                    </span>
                    <p className="text-[#0A1629] text-lg md:text-[26px] font-semibold line-clamp-1">
                      {item.name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 md:gap-2">
                    <div className="text-[#7D8592] text-xs md:text-sm flex gap-2 md:gap-3">
                      <span className="font-medium">Toʻlangan sana:</span>
                      {new Date(item.date_paied).toLocaleDateString()}
                    </div>
                    <div className="text-[#7D8592] text-xs md:text-sm flex gap-2 md:gap-3">
                      <span className="font-medium">Lavozimi:</span>
                      {item.position || "Lavozimi yoq"}
                    </div>
                    <div className="text-[#7D8592] text-xs md:text-sm flex gap-2 md:gap-3">
                      <span className="font-medium">Turi:</span>
                      {item.type}
                    </div>
                  </div>
                </div>

                <div className="h-full p-4 md:py-6 md:pl-6 md:pr-[60px]">
                  <p className="text-sm md:text-lg text-[#0A1629] font-semibold mb-2 md:mb-[15px]">
                    Toʻlov ma'lumotlari
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                    <div>
                      <span className="text-[#91929E] text-xs md:text-sm">
                        Toʻlangan narx
                      </span>
                      <p className="text-[#0A1629] text-sm md:text-base font-medium">
                        {item.pay_price} soʻm
                      </p>
                    </div>
                    <div>
                      <span className="text-[#91929E] text-xs md:text-sm">
                        Qolgan narx
                      </span>
                      <p className="text-[#0A1629] text-sm md:text-base font-medium">
                        {item.left_price} soʻm
                      </p>
                    </div>
                    {item.description && (
                      <div className="sm:col-span-2">
                        <span className="text-[#91929E] text-xs md:text-sm">
                          Izoh
                        </span>
                        <p className="text-[#0A1629] text-sm md:text-base font-medium">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
=======
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
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297
