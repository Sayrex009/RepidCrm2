"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Camera } from "lucide-react";

const positions: Record<string, string> = {
  "1": "Direktor",
  "2": "Backend",
  "3": "Frontend",
  "4": "Flutter",
  "5": "Smm manager",
  "6": "Designer",
  "7": "Project manager",
  "8": "Farrosh",
  "9": "Bugalter",
};

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [phone, setPhone] = useState("");
  const [login, setLogin] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken && session.user?.id) {
      setLoading(true);

      fetch(`https://crmm.repid.uz/employee/detail?user_id=${session.user.id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/json",
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Failed to fetch employee data");
          }
          return res.json();
        })
        .then((data) => {
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setAvatar(data.image || "");
          setPhone(data.phone_number || "");
          setLogin(data.username || "");
          setSelectedPosition(data.position_id?.toString() || "");
          setStartDate(data.date_of_jobstarted?.slice(0, 10) || "");
          setBirthDate(data.date_of_birth?.slice(0, 10) || "");
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [status, session]);

  const handleEditAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="px-[15px] sm:px-[30px] pt-[20px] pb-[40px] lg:overflow-auto min-h-screen bg-gray-200">
      <div>
        <div className="flex items-center mt-24 justify-between mb-5 md:mb-7">
          <h1 className="text-[#26273F] font-bold text-[24px] md:text-[32px]">Profil</h1>
        </div>

        {loading && (
          <div className="justify-center items-center flex h-screen">
            <div className="spinner"></div>
          </div>
        )}
        {error && <p className="text-red-600 mb-4">Xatolik: {error}</p>}

        {!loading && !error && (
          <>
            <div className="flex items-center gap-[18px] mb-7 md:mb-10">
              <div className="relative">
                <div className="max-w-[80px] min-w-[80px] max-h-[80px] min-h-[80px] md:max-w-[100px] md:min-w-[100px] md:max-h-[100px] md:min-h-[100px] overflow-hidden rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 shadow-md">
                  {avatar && !["None", "null", "undefined", ""].includes(avatar) ? (
                    <Image
                      src={
                        avatar.startsWith("http")
                          ? avatar
                          : `https://crmm.repid.uz/${avatar.startsWith("/") ? avatar.slice(1) : avatar}`
                      }
                      alt="Avatar"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="user"
                        width="40px"
                        height="40px"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleEditAvatar}
                  className="absolute bg-[#fff] w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full bottom-0 right-0 overflow-hidden shadow-lg"
                >
                  <Camera className="md:text-[20px]" size={16} />
                </button>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
              <p className="text-[#002B48] font-medium text-[18px] md:text-[22px]">
                {firstName} {lastName}
              </p>
            </div>

            <div className="w-full p-5 sm:p-[30px] bg-white rounded-lg">
              <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-6">
                <div>
                  <label className="text-[#7D8592] font-medium block mb-2">Ismi</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="ant-input ant-input-lg ant-input-outlined w-full md:text-[17px] md:h-[46px] px-3 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="text-[#7D8592] font-medium block mb-2">Familiyasi</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="ant-input ant-input-lg ant-input-outlined w-full md:text-[17px] md:h-[46px] px-3 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="text-[#7D8592] font-medium block mb-2">Telefon raqami</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="ant-input ant-input-lg ant-input-outlined w-full md:text-[17px] md:h-[46px] px-3 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="text-[#7D8592] font-medium block mb-2">Login</label>
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="ant-input ant-input-lg ant-input-outlined w-full md:text-[17px] md:h-[46px] px-3 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="text-[#7D8592] font-medium block mb-2">Lavozimi</label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="ant-input ant-input-lg ant-input-outlined w-full md:text-[17px] md:h-[46px] px-3 border border-gray-300 rounded"
                  >
                    {Object.entries(positions).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#7D8592] font-medium block mb-2">Ishga kirgan sanasi</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="ant-input ant-input-lg ant-input-outlined w-full md:text-[17px] md:h-[46px] px-3 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="text-[#7D8592] font-medium block mb-2">Tug‘ilgan sanasi</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="ant-input ant-input-lg ant-input-outlined w-full md:text-[17px] md:h-[46px] px-3 border border-gray-300 rounded"
                  />
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
