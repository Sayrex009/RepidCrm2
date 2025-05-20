"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import repidLogo from "./../../../public/Icons/image.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        login: username,
        password,
      });

      if (result?.error) {
<<<<<<< HEAD
        throw new Error("Login yoki parol notog'ri");
=======
        throw new Error("Неверные учетные данные");
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297
      } else {
        router.push("/employees");
      }
    } catch (err) {
      setError(err.message || "Произошла ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Placeholder for background image */}
<<<<<<< HEAD
      <div className="hidden justify-center items-center lg:flex relative w-[850px] h-[880px] lg:ml-[40px] lg:mt-[34px] bg-[#23243E]  rounded-[29px]">
=======
      <div className="hidden justify-center items-center lg:flex lg:block relative w-[850px] h-[880px] lg:ml-[40px] lg:mt-[34px] bg-[#23243E]  rounded-[29px]">
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297
        <Image src={repidLogo} alt="logo" />
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-[52%] flex flex-col items-center justify-center">
        <p className="text-3xl font-medium text-[#002B48] mb-5 sm:mb-7">
          Kirish
        </p>
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col gap-y-6 items-center">
            <div className="w-full flex flex-col items-start gap-y-2">
              <label
                className="text-[#002B48] text-sm sm:text-base"
                htmlFor="login"
              >
                Login
              </label>
              <input
                autoCapitalize="none"
                className={`w-full outline-none ring-1 ${
                  error ? "ring-red-500" : "ring-[#002B48]"
                } px-[30px] py-[15px] rounded-[20px]`}
                type="text"
                id="login"
                placeholder="Foydalanovchi nomi"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="w-full flex flex-col items-start gap-y-2">
              <label
                className="text-[#002B48] text-sm sm:text-base"
                htmlFor="password"
              >
                Parol
              </label>
              <div className="relative w-full">
                <input
                  className={`w-full outline-none ring-1 ${
                    error ? "ring-red-500" : "ring-[#002B48]"
                  } pl-[30px] pr-[50px] py-[15px] rounded-[20px]`}
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  placeholder="Parolni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute top-3.5 right-4"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  disabled={loading}
                >
                  <span className="text-[#002B48] text-[24px]">
                    {passwordVisible ? (
                      <svg
                        viewBox="64 64 896 896"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                      >
                        <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                      </svg>
                    ) : (
                      <svg
                        viewBox="64 64 896 896"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                      >
                        <path d="M396 512a112 112 0 10224 0 112 112 0 10-224 0zm546.2-25.8C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM508 688c-97.2 0-176-78.8-176-176s78.8-176 176-176 176 78.8 176 176-78.8 176-176 176z"></path>
                      </svg>
                    )}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "bg-[#F48C06]/80 cursor-not-allowed"
                  : "bg-[#F48C06] hover:bg-[#F48C06]/80 cursor-pointer"
              } text-white mt-7 flex items-center justify-center duration-200 h-[50px] w-[200px] font-medium rounded-[36px] text-lg`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Kirilmoqda...
                </>
              ) : (
                "Kirish"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
