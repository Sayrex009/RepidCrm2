"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
export default function EmployeesPage() {
  const { data: session } = useSession();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    if (session?.accessToken) {
      let url = `https://crmm.repid.uz/employee?page=${currentPage}&size=10`;
      if (selectedPosition) {
        url += `&position_id=${selectedPosition}`;
      }

      fetch(url, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setEmployees(data.items || []);
          setTotalPages(Math.ceil(data.total / data.size));
          setLoading(false);
        })
        .catch((err) => {
          console.error("", err);
          setError("");
          setLoading(false);
        });
    } else {
      setError("");
      setLoading(false);
    }
  }, [session, currentPage, selectedPosition]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value ? parseInt(e.target.value) : null);
    setCurrentPage(1);
  };

  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (loading)
    return (
      <div className="justify-center items-center flex h-screen">
        <div className="spinner"></div>
      </div>
    );

  return (
    <main className="px-[15px] sm:px-[30px] pt-[20px] bg-gray-200 pb-[40px] ">
      <h1 className="text-[#26273F] mt-24 font-bold text-[24px] md:text-[32px] md:mb-7">
        Xodimlar
      </h1>

      <div className="flex flex-col sm:flex-row items-center gap-5 sm:items-end mb-10 sm:mb-[28px]">
        <div className="w-full sm:w-auto">
          <p className="text-xs text-[#787F95] mb-1 ">MUTAXASSISLIK</p>

          <div className="relative w-full sm:w-[300px]">
            <select
              className="custom-select w-full min-h-[45px] pl-4 pr-10 py-2 rounded-[12px] border border-[#E5E7EB] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#F48C06] focus:border-[#F48C06] appearance-none bg-white text-gray-700"
              value={selectedPosition || ""}
              onChange={handlePositionChange}
            >
              <option value="">Barchasi</option>
              <option value="2">Backend</option>
              <option value="3">Frontend</option>
              <option value="4">Flutter</option>
              <option value="5">Smm manager</option>
              <option value="6">Designer</option>
              <option value="7">Project manager</option>
              <option value="8">Farrosh</option>
              <option value="9">Bugalter</option>
            </select>
            <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-[#F48C06]">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-5 md:gap-y-[10px]">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="relative  lg:w-full md:h-[90px] py-5 md:py-0 flex items-center rounded-[24px] bg-white overflow-hidden shadow-sm"
          >
            <div className="w-full h-full flex flex-col md:flex-row items-center gap-5 md:gap-16  scrollbar-none pl-[24px] pr-[24px] md:pr-[100px]">
              <div className="flex items-center gap-[18px] w-full border-b border-[#E4E6E8] md:border-none pb-4 md:pb-0 md:min-w-[280px] md:max-w-[280px]">
                <div className="min-w-[50px] max-w-[50px] h-[50px] rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 shadow-md overflow-hidden">
                  {employee.image ? (
                    <img
                      className="w-full h-full object-cover"
                      src={employee.image}
                      alt="user image"
                    />
                  ) : (
                    <span
                      role="img"
                      aria-label="user"
                      className="anticon anticon-user text-[23px] text-gray-500"
                    >
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="user"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                      </svg>
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start gap-y-1">
                  <p className="text-[#0A1629] font-semibold line-clamp-1">
                    {employee.first_name} {employee.last_name}
                  </p>
                  <a
                    className="text-[#91929E] text-sm"
                    href={`tel:${employee.phone_number}`}
                  >
                    {employee.phone_number}
                  </a>
                </div>
              </div>

              <div className="flex md:flex-col items-center justify-between md:items-start gap-y-1 w-full md:min-w-[170px] md:max-w-[170px]">
                <span className="text-[#91929E] text-sm">Mutaxassisligi</span>
                <p className="text-[#0A1629] line-clamp-1">
                  {employee.position || ""}
                </p>
              </div>

              <div className="flex md:flex-col items-center justify-between md:items-start gap-y-1 w-full md:min-w-[150px] md:max-w-[150px]">
                <span className="text-[#91929E] text-sm">
                  Ish boshlagan sanasi
                </span>
                <p className="text-[#0A1629]">
                  {employee.date_of_jobstarted
                    ? new Date(employee.date_of_jobstarted).toLocaleDateString(
                        "ru-RU",
                      )
                    : ""}
                </p>
              </div>
            </div>

            <div className="md:h-full md:flex items-center justify-center absolute md:w-[80px] top-3 right-3 md:top-0 md:right-0 md:bg-white">
              <button className="md:bg-gray-200/80 w-[40px] h-[40px] flex items-center justify-center rounded-md">
                <span
                  role="img"
                  aria-label="more"
                  className="anticon anticon-more text-[28px] md:text-[24px]"
                >
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="more"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z"></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-7">
        <ul className="flex items-center gap-1">
          <li
            className={`ant-pagination-prev ${
              currentPage === 1 ? "ant-pagination-disabled" : ""
            }`}
          >
            <button
              className="ant-pagination-item-link"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="left"
                width="1em"
                height="1em"
                fill="currentColor"
              >
                <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
              </svg>
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={`ant-pagination-item ${
                currentPage === page ? "ant-pagination-item-active" : ""
              }`}
            >
              <button
                onClick={() => setCurrentPage(page)}
                className="px-2 py-1 border-2 rounded-[5px] border-gray-200 bg-white hover:border-amber-300 cursor-pointer"
              >
                {page}
              </button>
            </li>
          ))}

          <li
            className={`ant-pagination-next ${
              currentPage === totalPages ? "ant-pagination-disabled" : ""
            }`}
          >
            <button
              className="ant-pagination-item-link"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="right"
                width="1em"
                height="1em"
                fill="currentColor"
              >
                <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </main>
  );
}
