import React from "react";
import { authOptions } from "@/lib/auth"; // путь к твоему authOptions
import { getServerSession } from "next-auth/next";

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

async function getEmployeeDetail(userId: number, accessToken: string): Promise<Employee> {
  const res = await fetch(`https://crmm.repid.uz/employee/detail?user_id=${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Not authenticated");
    }
    throw new Error("Failed to fetch employee detail");
  }

  const data = await res.json();
  return data;
}

export default async function EmployeeProfile({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }

  const userId = Number(params.id);
  if (isNaN(userId)) {
    throw new Error("Invalid user id");
  }

  const employee = await getEmployeeDetail(userId, session.accessToken);

  return (
    <main style={{ padding: 20 }}>
      <h1>Профиль сотрудника</h1>
      <img
        src={employee.image || "/default-avatar.png"}
        alt={`${employee.first_name} ${employee.last_name}`}
        width={150}
        height={150}
        style={{ borderRadius: "50%" }}
      />
      <h2>
        {employee.first_name} {employee.last_name}
      </h2>
      <p>Должность: {employee.position_name}</p>
      {employee.phone_number && <p>Телефон: {employee.phone_number}</p>}
      {employee.date_of_birth && <p>Дата рождения: {new Date(employee.date_of_birth).toLocaleDateString()}</p>}
      {employee.date_of_jobstarted && <p>Дата начала работы: {new Date(employee.date_of_jobstarted).toLocaleDateString()}</p>}
    </main>
  );
}
