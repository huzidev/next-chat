"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { username, email, password, confirmPassword } = user;
  const router = useRouter();

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
      // const response = await fetch("/api/auth/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(user),
      // });
      // const data = await response.json();
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = response.user.uid; // Get the user ID
      console.log("response", userId);

      await setDoc(doc(db, "users", userId), {
        id: userId,
        email,
        username,
        password,
        confirmPassword,
        createdAt: new Date().toISOString(),
      });

      if (response) {
        localStorage.setItem("user", userId);
        router.push("/");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Something went wrong. Please try again.");
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
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => handleChange(e)}
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
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleChange(e)}
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
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handleChange(e)}
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
              onChange={(e) => handleChange(e)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full mt-2 bg-red-600 rounded-full hover:bg-blue-700 text-white py-2"
          >
            Register
          </Button>
          <p>
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600">
              Signin
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
