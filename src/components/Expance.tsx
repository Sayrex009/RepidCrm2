"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  position: string | null;
  date_of_jobstarted: string | null;
  image: string | null;
}

interface ApiResponse {
  items: Employee[];
  total: number;
  size: number;
}

export default function EmployeesPage() {
  const { data: session } = useSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchEmployees() {
      if (!session?.accessToken) {
        setError("Пользователь не авторизован");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      let url = `https://crmm.repid.uz/employee?page=${currentPage}&size=3`;
      if (selectedPosition) {
        url += `&position_id=${selectedPosition}`;
      }

      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/json",
          },
        });

        if (res.status === 401) {
          setError("Ошибка 401: Неавторизованный доступ. Проверьте токен.");
          setEmployees([]);
          setTotalPages(0);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`Ошибка HTTP: ${res.status}`);
        }

        const data: ApiResponse = await res.json();

        setEmployees(data.items || []);
        setTotalPages(Math.ceil(data.total / data.size));
        setLoading(false);
      } catch (err: any) {
        console.error("Ошибка загрузки данных сотрудников", err);
        setError("Ошибка загрузки данных сотрудников");
        setEmployees([]);
        setTotalPages(0);
        setLoading(false);
      }
    }

    fetchEmployees();
  }, [session, currentPage, selectedPosition]);

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPosition(e.target.value ? parseInt(e.target.value) : null);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <main className="px-3 sm:px-8 pt-2 rounded-2xl shadow-md bg-white pb-10 h-full">
      <h1 className="text-[#26273F] mt-4 font-bold text-2xl md:text-4xl mb-7">
        Xodimlar
      </h1>

      <div className="flex flex-col gap-5 md:gap-3">
        {employees.length === 0 && (
          <p className="text-center text-gray-500">Сотрудники не найдены.</p>
        )}
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="relative lg:w-full md:h-[90px] py-5 md:py-0 flex items-center rounded-xl bg-white overflow-hidden shadow-sm"
          >
            <div className="w-full h-full flex flex-col md:flex-row items-center gap-5 md:gap-16 pl-6 pr-6 md:pr-24">
              <div className="flex items-center gap-4 w-full border-b border-gray-300 md:border-none pb-4 md:pb-0 md:min-w-[280px] md:max-w-[280px]">
                <div className="w-[50px] h-[50px] rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 shadow-md overflow-hidden">
                  {employee.image ? (
                    <img
                      className="w-full h-full object-cover"
                      src={employee.image}
                      alt={`${employee.first_name} ${employee.last_name}`}
                    />
                  ) : (
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="user"
                      width="24"
                      height="24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="text-gray-400"
                    >
                      <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                    </svg>
                  )}
                </div>
                <div className="flex flex-col items-start gap-1">
                  <p className="text-[#0A1629] font-semibold truncate">
                    {employee.first_name} {employee.last_name}
                  </p>
                  <a
                    className="text-gray-500 text-sm"
                    href={`tel:${employee.phone_number}`}
                  >
                    {employee.phone_number}
                  </a>
                </div>
              </div>

              <div className="flex md:flex-col items-center justify-between md:items-start gap-1 w-full md:min-w-[170px] md:max-w-[170px]">
                <span className="text-gray-500 text-sm">Mutaxassisligi</span>
                <p className="text-[#0A1629] truncate">
                  {employee.position || ""}
                </p>
              </div>

              <div className="flex md:flex-col items-center justify-between md:items-start gap-1 w-full md:min-w-[150px] md:max-w-[150px]">
                <span className="text-gray-500 text-sm">
                  Ish boshlagan sanasi
                </span>
                <p className="text-[#0A1629]">
                  {employee.date_of_jobstarted
                    ? new Date(employee.date_of_jobstarted).toLocaleDateString(
                        "ru-RU"
                      )
                    : ""}
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push(`/profiles/${employee.id}`)}
              className="md:bg-gray-200/80 w-[40px] h-[40px] flex items-center justify-center rounded-md"
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="more"
                width="24"
                height="24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-2 rounded ${
                page === currentPage
                  ? "bg-[#F48C06] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
