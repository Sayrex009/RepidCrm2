// app/employees/[id]/page.tsx
import React from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { User } from "lucide-react";

type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number?: string;
  position_name: string;
  date_of_birth?: string;
  date_of_jobstarted?: string;
  image?: string | null;
};

async function getEmployeeDetail(
  userId: number,
  accessToken: string
): Promise<Employee> {
  const res = await fetch(
    `https://crmm.repid.uz/employee/detail?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    if (res.status === 401) throw new Error("Not authenticated");
    throw new Error("Failed to fetch employee detail");
  }

  const data = await res.json();
  return data;
}

export default async function EmployeeProfile({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Not authenticated");

  const userId = Number(params.id);
  if (isNaN(userId)) throw new Error("Invalid user id");

  const employee = await getEmployeeDetail(userId, session.accessToken);
  const imageUrl = employee.image?.startsWith("http")
    ? employee.image
    : `https://crmm.repid.uz/${employee.image?.replace(/^\/?/, "")}`;

  return (
    <main className="px-[15px] sm:px-[30px] pt-[20px] pb-[40px] lg:overflow-auto min-h-screen bg-gray-200">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-5 md:mb-7">
        <h1 className="text-[#26273F] font-bold text-[24px] md:text-[32px] mt-24">
          Xodimlar
        </h1>
        <button className="flex items-center gap-2 text-gray-500 font-medium md:hidden">
          {/* SVG иконка */}
          <span className="text-[20px]">
            <svg
              viewBox="64 64 896 896"
              fill="currentColor"
              width="1em"
              height="1em"
            >
              <path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" />
            </svg>
          </span>
          <span>Orqaga</span>
        </button>
      </div>

      {/* Инфо о сотруднике */}
      <div className="flex items-center gap-[18px] mb-7 md:mb-10">
        <div className="relative">
          <div className="max-w-[80px] min-w-[80px] max-h-[80px] min-h-[80px] md:max-w-[100px] md:min-w-[100px] md:max-h-[100px] md:min-h-[100px] overflow-hidden rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 shadow-md">
            {employee.image ? (
              <img
                src={imageUrl}
                alt={`${employee.first_name} ${employee.last_name}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-8 h-8 text-gray-500" />
            )}
          </div>
        </div>
        <p className="text-[#002B48] font-medium text-[18px] md:text-[22px]">
          {employee.first_name} {employee.last_name}
        </p>
      </div>

      {/* Детали */}
      <div className="bg-white p-5 sm:p-[30px] rounded-lg shadow-md text-gray-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-4">
          <div>
            <label className="text-[#7D8592] font-medium">Ismi</label>
            <input
              value={employee.first_name}
              disabled
              className="ant-input ant-input-disabled w-full md:text-[17px] md:h-[46px] rounded-md border px-3 py-2 mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-[#7D8592] font-medium">Familiyasi</label>
            <input
              value={employee.last_name}
              disabled
              className="ant-input ant-input-disabled w-full md:text-[17px] md:h-[46px] rounded-md border px-3 py-2 mt-1 bg-gray-100"
            />
          </div>

          {employee.phone_number && (
            <div>
              <label className="text-[#7D8592] font-medium">Telefon raqami</label>
              <input
                value={employee.phone_number}
                disabled
                className="ant-input ant-input-disabled w-full md:text-[17px] md:h-[46px] rounded-md border px-3 py-2 mt-1 bg-gray-100"
              />
            </div>
          )}

          {employee.date_of_birth && (
            <div>
              <label className="text-[#7D8592] font-medium">Tug‘ilgan sana</label>
              <input
                value={new Date(employee.date_of_birth).toLocaleDateString()}
                disabled
                className="ant-input ant-input-disabled w-full md:text-[17px] md:h-[46px] rounded-md border px-3 py-2 mt-1 bg-gray-100"
              />
            </div>
          )}

          {employee.date_of_jobstarted && (
            <div>
              <label className="text-[#7D8592] font-medium">Ish boshlagan sana</label>
              <input
                value={new Date(employee.date_of_jobstarted).toLocaleDateString()}
                disabled
                className="ant-input ant-input-disabled w-full md:text-[17px] md:h-[46px] rounded-md border px-3 py-2 mt-1 bg-gray-100"
              />
            </div>
          )}

          <div>
            <label className="text-[#7D8592] font-medium">Lavozimi</label>
            <input
              value={employee.position_name}
              disabled
              className="ant-input ant-input-disabled w-full md:text-[17px] md:h-[46px] rounded-md border px-3 py-2 mt-1 bg-gray-100"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
  