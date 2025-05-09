"use client";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [phone, setPhone] = useState("");
  const [login, setLogin] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user) {
      setFirstName(session.user.first_name || "");
      setLastName(session.user.last_name || "");
      setAvatar(session.user.image || "");
      setPhone(session.user.phone_number || "");
      setLogin(session.user.email || "");
      setSelectedPosition(session.user.position_id?.toString() || "");
      setStartDate(session.user.start_date || "");
      setBirthDate(session.user.birth_date || "");
    }
  }, [session]);

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPosition(e.target.value);
  };

  const handleAvatarClick = () => {
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

  const handleSave = () => {
    console.log({
      firstName,
      lastName,
      phone,
      login,
      startDate,
      birthDate,
      selectedPosition,
      avatar,
    });
  };

  const handlePasswordChangeClick = () => {
    setShowPasswordModal(true);
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
  };

  return (
    <div className="p-6 bg-[#F9FAFB]">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 mt-24">
        Profil
      </h1>

      <div className="flex items-center gap-[18px] mb-7 md:mb-10">
        <div className="relative">
          <div className="w-[100px] h-[100px] overflow-hidden rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 shadow-md">
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                role="img"
                aria-label="user"
                className="text-[40px] text-gray-500"
              >
                👤
              </span>
            )}
            <button
              onClick={handleAvatarClick}
              className="absolute bg-white w-10 h-10 flex items-center justify-center rounded-full bottom-0 right-0 shadow-lg"
            >
              ✎
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
        <p className="text-[#002B48] font-medium text-[22px]">
          {firstName} {lastName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input label="Ismi" value={firstName} onChange={setFirstName} />
        <Input label="Familiyasi" value={lastName} onChange={setLastName} />
        <Input label="Telefon raqami" value={phone} onChange={setPhone} />
        <Input label="Login" value={login} onChange={setLogin} />
        <div>
          <label className="block text-sm mb-1 text-gray-700">Lavozimi</label>
          <select
            className="w-full min-h-[45px] pl-4 pr-10 py-2 rounded-[12px] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#F48C06] bg-white text-gray-700"
            value={selectedPosition}
            onChange={handlePositionChange}
          >
            <option value="2">Backend</option>
            <option value="3">Frontend</option>
            <option value="4">Flutter</option>
            <option value="5">Smm manager</option>
            <option value="6">Designer</option>
            <option value="7">Project manager</option>
            <option value="8">Farrosh</option>
            <option value="9">Bugalter</option>
          </select>
        </div>
        <Input
          label="Ish boshlagan sanasi"
          type="date"
          value={startDate}
          onChange={setStartDate}
        />
        <Input
          label="Tug'ilgan sanasi"
          type="date"
          value={birthDate}
          onChange={setBirthDate}
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePasswordChangeClick}
          className="bg-[#F48C06] text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-500"
        >
          Parolni o'zgartirish
        </button>
        <button
          onClick={handleSave}
          className="bg-[#F48C06] text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-500"
        >
          Saqlash
        </button>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Parolni o'zgartirish</h2>
            <input
              type="password"
              placeholder="Yangi parol"
              className="w-full mb-3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#F48C06]"
            />
            <input
              type="password"
              placeholder="Parolni tasdiqlash"
              className="w-full mb-3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#F48C06]"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-md border border-gray-400 text-gray-700"
              >
                Bekor qilish
              </button>
              <button className="px-4 py-2 rounded-md bg-[#F48C06] text-white hover:bg-orange-500">
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  type?: string;
  onChange: (val: string) => void;
};

function Input({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-700">{label}</label>
      <input
        type={type}
        className="w-full min-h-[45px] px-4 py-2 rounded-[12px] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#F48C06]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
