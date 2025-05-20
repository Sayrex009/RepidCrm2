export async function getEmployeeDetail(userId: number, accessToken: string) {
  const res = await fetch(`https://crmm.repid.uz/employee/detail?user_id=${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to fetch employee detail");
  }

  return res.json();
}
