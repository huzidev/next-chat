"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (user) {
      console.log("?", user);
      setIsUserLoggedIn(true);
    }
  }, [location.pathname]);

  const loggedOutPaths = [
    { key: "/auth/signin", value: "SignIn" },
    { key: "/auth/signup", value: "SignUp" },
  ];
  const loggedInPaths = [
    { key: "/messages", value: "Messages" },
    { key: `/user/me`, value: "Profile" },
  ];

  const paths = isUserLoggedIn ? loggedInPaths : loggedOutPaths;

  function logout() {
    localStorage.removeItem("user");
    router.push("/auth/signin");
    setIsUserLoggedIn(false);
  }

  return (
    <header className="dark:bg-zinc-900/50 bg-zinc-100/50 p-4">
      <div className="container max-w-[1200] mx-auto flex items-center justify-center">
        <Link href="/" className="flex justify-center items-center">
          <Image src="/logo.png" width={60} height={60} alt="logo" />
        </Link>
        <div className="flex-grow" />
        <div className="space-x-4 text-md flex items-center">
          {paths.map(({ key, value }) => (
            <Link href={key} key={key} className="hover:underline">
              {value}
            </Link>
          ))}
          {isUserLoggedIn && (
            <button onClick={logout} className="hover:underline">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
