"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  SquareUserRoundIcon,
  ListTodoIcon,
  Users,
  LogOut,
  ArrowDownUpIcon,
  ChartPieIcon,
  HeadsetIcon,
  Menu,
  X,
  Search as SearchIcon,
} from "lucide-react";
import repidLogo from "./../../public/Icons/repidLogo.svg";
import { motion } from "framer-motion";

const Navbar = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const menuItems = [
    { href: "/dashboard", icon: <ChartPieIcon />, label: "Dashboard" },
    { href: "/income", icon: <ArrowDownUpIcon />, label: "Kirim chiqim" },
    { href: "/employees", icon: <SquareUserRoundIcon />, label: "Hodimlar" },
    { href: "/operators", icon: <HeadsetIcon />, label: "Operator" },
    { href: "/tasks", icon: <ListTodoIcon />, label: "Vazifalar" },
    { href: "/projects", icon: <Users />, label: "Loyihalar" },
  ];

  const toggleBodyOverflow = (isOpen: boolean) => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  };

  toggleBodyOverflow(mobileMenuOpen);

  return (
    <>
      {/* Mobile Navbar */}
      <div className="px-4 pt-3 fixed lg:hidden z-50">
        <div className="h-[70px] w-full flex items-center justify-between bg-white rounded-[24px] p-4 shadow-lg">
          <Link href="/employees">
            <Image
              src={repidLogo}
              alt="repid logo"
              width={80}
              height={40}
              className="mr-[250px]"
            />
          </Link>
          <div className="flex gap-1  justify-between items-center">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 sm:mr-2 rounded-full hover:bg-gray-100 transition duration-200"
            >
              <SearchIcon size={24} color="#64748B" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
            >
              {mobileMenuOpen ? (
                <X size={24} color="#64748B" />
              ) : (
                <Menu size={24} color="#64748B" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="fixed inset-0 bg-white z-[999] p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold text-[#002B48]">Qidiruv</p>
            <button onClick={() => setSearchOpen(false)}>
              <X size={24} color="#64748B" />
            </button>
          </div>
          <div className="relative">
            <input
              className="w-full h-11 pl-11 pr-4 bg-[#F5F5FA] outline-none font-medium rounded-lg text-[#002B48] ring-1 ring-transparent focus:ring-primary duration-200"
              placeholder="Qidiruv..."
              type="text"
            />
            <SearchIcon
              className="absolute top-[10px] left-[10px]"
              size={20}
              color="#64748B"
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[998] p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="border-t border-gray-200 my-2"></div>

            <div className="">
              <Image
                src={repidLogo}
                alt="repid logo"
                width={80}
                height={40}
                className="mr-[355px]"
              />
            </div>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X size={24} color="#64748B" />
            </button>
          </div>
          <div className="flex flex-col gap-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <button className="group text-lg font-medium px-3.5 py-2.5 w-full rounded-[9px] duration-200 flex items-center gap-x-3 hover:bg-[#26273f1e] text-[#3B424A]">
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </Link>
            ))}
            <div className="border-t border-gray-200 my-2"></div>
            <button
              onClick={() => {
                signOut({ callbackUrl: "/login" });
                setMobileMenuOpen(false);
              }}
              className="text-lg font-medium px-3.5 py-2.5 w-full rounded-[9px] duration-150 flex items-center gap-x-3 hover:bg-[#26273f1e] text-[#3B424A] active:scale-95"
            >
              <LogOut size={20} />
              <span>Profildan chiqish</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Navbar */}
      <div className="hidden lg:flex ">
        {/* Sidebar */}
        <div className="flex flex-col h-screen  top-0 min-w-[300px] max-w-[250px]">
          <section className="bg-[#fff] px-8 py-6 flex-1">
            <div className="flex">
              <Link href="/employees">
                <Image src={repidLogo} alt="Repid Logo" />
              </Link>
            </div>

            <div className="flex flex-col gap-y-2 mt-12">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button className="group text-lg font-medium px-3.5 py-2.5 w-full rounded-[9px] duration-200 flex items-center gap-x-3 hover:bg-[#26273f1e] text-[#3B424A]">
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </Link>
              ))}
              <p className="font-semibold text-[#7B8190] text-base py-1 mt-6">
                SOZLAMALAR
              </p>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-lg font-medium px-3.5 py-2.5 w-full rounded-[9px] duration-150 flex items-center gap-x-3 hover:bg-[#26273f1e] text-[#3B424A] active:scale-95"
              >
                <LogOut size={20} />
                <span>Profildan chiqish</span>
              </button>
            </div>
          </section>
        </div>

        {/* Search and Profile */}
        <div className="flex-1 relative">
          <div className="w-[1630px] fixed h-24 top-0 bg-[#fff] border-t-2 border-[#eff2f4d7] flex items-center justify-between px-6 z-10">
            <div className="relative">
              <input
                className="w-[250px] xl:w-[372px] h-11 pl-11 pr-4 bg-[#F5F5FA] outline-none font-medium rounded-lg text-[#002B48] ring-1 ring-transparent focus:ring-primary duration-200"
                placeholder="Qidiruv..."
                type="text"
              />
              <SearchIcon
                className="absolute top-[10px] left-[10px]"
                size={20}
                color="#64748B"
              />
            </div>
            <div className="flex gap-3 xl:gap-10">
              <div className="flex items-center gap-4 mr-12">
                <div className="flex flex-col items-end">
                  <p className="text-[#002B48] font-medium">
                    {session?.user?.first_name} {session?.user?.last_name}
                  </p>
                  <p className="text-[12px] text-[#787F95]">
                    {session?.user?.position_name || "Xodim"}
                  </p>
                </div>
                <Link href="/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-[45px] h-[45px] rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 shadow-md overflow-hidden cursor-pointer lg:mr-4"
                  >
                    {session?.user?.user_image &&
                    (session.user.user_image.startsWith("/") ||
                      session.user.user_image.startsWith("http")) ? (
                      <Image
                        src={session.user.user_image}
                        alt="User avatar"
                        width={45}
                        height={45}
                        className="object-cover"
                      />
                    ) : (
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
                    )}
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
