'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Page() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  }

  async function signin() {
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      if (response) {
        console.log("Successfully signed in: ", response?.user?.uid);
      }
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  }

  const { email, password } = user;

  return (
    <main className="bg-[#26313c] h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Signin
        </h1>
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="font-medium text-gray-700">
              Email
            </label>
            <Input
              className="mt-2 bg-gray-100 rounded-full border border-gray-300 px-4 py-2"
              type="email"
              value={email}
              id="email"
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-medium text-gray-700">
              Password
            </label>
            <Input
              className="mt-2 bg-gray-100 rounded-full border border-gray-300 px-4 py-2"
              type="password"
              id="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          <Button
            onClick={signin}
            type="submit"
            className="w-full mt-2 bg-red-600 rounded-full hover:bg-blue-700 text-white py-2"
          >
            Signin
          </Button>
        </form>
      </div>
    </main>
  );
}
