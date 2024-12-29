"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Page() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { email, password, confirmPassword } = user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Fields are required.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
    } else if (password.length < 8) {
      setError("Please enter a valid password.");
    } else {
      await signup();
      setError("");
      alert("Form submitted!");
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  }

  // Firebase sign up function
  async function signup() {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up: ", response);
      // Add user data to your database
      // await addUserToDatabase(response.user);
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  }


  return (
    <main className="bg-[#26313c] h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Register
        </h1>
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
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="font-medium text-gray-700">
              Email
            </label>
            <Input
              className="mt-2 bg-gray-100 rounded-full border border-gray-300 px-4 py-2"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
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
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <Input
              className="mt-2 bg-gray-100 rounded-full border border-gray-300 px-4 py-2"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Enter your password"
              value={confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full mt-2 bg-red-600 rounded-full hover:bg-blue-700 text-white py-2"
          >
            Register
          </Button>
        </form>
      </div>
    </main>
  );
}
