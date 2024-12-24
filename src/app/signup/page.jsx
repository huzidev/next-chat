"use client"; // Ensure this directive is at the top

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both fields are required.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password) || password.length < 8
    ) {
      setError("Please enter a valid password.");
    } else {
      setError("");
      alert("Form submitted!");
    }
  };

  return (
    <main className="bg-[#26313c] h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="font-medium text-gray-700">
              Username
            </label>
            <Input
              className="mt-2 bg-gray-100 rounded-full border border-gray-300 px-4 py-2"
              type="username"
              id="username"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <label htmlFor="email" className="font-medium text-gray-700">
            Email
          </label>
          <Input
            className="mt-2 bg-gray-100 rounded-full border border-gray-300 px-4 py-2"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="font-medium text-gray-700">
            Password
          </label>
          <Input
            className="mt-2 bg-gray-100 rounded-full border border-gray-300 px-4 py-2"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full mt-6 bg-red-600 rounded-full hover:bg-blue-700 text-white py-2"
          >
            Register
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          @2024 All rights reserved
        </p>
      </div>
    </main>
  );
}
