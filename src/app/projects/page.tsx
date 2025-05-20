"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Calendar } from "lucide-react";
import Image from "next/image";

const { RangePicker } = DatePicker;

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

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [statusFilter, setStatusFilter] = useState("all"); // Исправлено: добавлен setStatusFilter
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchProjects = async (
    startDate: string,
    endDate: string,
    token: string
  ) => {
    try {
      setLoading(true);
      const params: Record<string, any> = {};

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await axios.get(`https://crmm.repid.uz/employee/projects`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setProjects(res.data.items);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange: RangePickerProps["onChange"] = (_, dateStrings) => {
    setDateRange(dateStrings as [string, string]);
  };

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetchProjects(dateRange[0], dateRange[1], session.accessToken as string);
    }
  }, [status, session, dateRange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredProjects =
    statusFilter === "all"
      ? projects
      : projects.filter((p) => p.status === statusFilter);

  if (status === "loading")
    return (
      <div className="justify-center items-center flex h-screen">
        <div className="spinner"></div>
      </div>
    );
  if (status === "unauthenticated")
    return (
      <p className="text-center py-8 text-red-500">Kirish talab qilinadi</p>
    );

  return (
    <main className="min-h-screen bg-gray-100 sm:px-[30px] pt-[20px] pb-[40px]">
      <h1 className="text-[#26273F] mt-24 font-bold text-[24px] md:text-[32px] mb-5 md:mb-7">
        Loyihalar
      </h1>

      <div className="flex flex-col md:flex-row gap-5 items-center justify-between mb-[28px]">
        <RangePicker
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          className="h-[44px] w-[480px]"
          placeholder={["Boshlanish", "Tugash"]}
        />

        <div className="flex items-center gap-[60px]">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-[#fff]  hover:shadow transition"
            >
              <span
                role="img"
                aria-label="filter"
                className="anticon anticon-filter text-[24px]"
              >
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="filter"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M880.1 154H143.9c-24.5 0-39.8 26.7-27.5 48L349 597.4V838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V597.4L907.7 202c12.2-21.3-3.1-48-27.6-48zM603.4 798H420.6V642h182.9v156zm9.6-236.6l-9.5 16.6h-183l-9.5-16.6L212.7 226h598.6L613 561.4z"></path>
                </svg>
              </span>
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-20">
                <ul className="py-1 text-sm text-gray-700">
                  <li>
                    <button
                      onClick={() => {
                        setStatusFilter("all");
                        setShowStatusDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Barchasi
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setStatusFilter("in_progres");
                        setShowStatusDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Jarayonda
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setStatusFilter("done");
                        setShowStatusDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Tugallangan
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="justify-center items-center flex h-screen">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-y-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="relative w-full bg-white rounded-[24px] overflow-hidden shadow-sm"
            >
              <div className="flex flex-col md:flex-row w-full overflow-auto scrollbar-none">
                <div className="w-full xl:min-w-[470px] xl:max-w-[470px] md:min-w-[400px] md:max-w-[400px] border-b md:border-b-0 md:border-r border-[#E4E6E8] p-6">
                  <div className="flex items-center gap-[18px] mb-[15px]">
                    <div>
                      <span className="text-[#91929E] text-sm">
                        Loyiha nomi
                      </span>
                      <p className="text-[#0A1629] text-[20px] md:text-[26px] font-semibold line-clamp-1">
                        {project.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#7D8592] text-sm md:text-base flex gap-3">
                      <Calendar />
                      {dayjs(project.start_date).format("YYYY-MM-DD")}
                    </span>
                    <span className="text-[#7D8592] text-sm md:text-base flex gap-3">
                      <Calendar />
                      {dayjs(project.end_date).format("YYYY-MM-DD")}
                    </span>
                  </div>
                </div>
                <div className="h-full py-6 pl-6 md:pl-[60px] pr-[120px]">
                  <p className="text-base md:text-lg text-[#0A1629] font-semibold mb-[15px]">
                    Loyiha ma’lumotlari
                  </p>
                  <div className="flex items-start gap-[60px]">
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
                          : "Noma’lum"}
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
                            <button className="rounded-full border-2 border-white flex items-center justify-center w-[40px] h-[40px] bg-gray-400 overflow-hidden hover:scale-105 transition">
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
                            </button>
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                              {prog.first_name} {prog.last_name}
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
      )}
    </main>
  );
}
