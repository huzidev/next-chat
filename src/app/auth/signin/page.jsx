"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  }

  console.log("user", user);

  async function signin() {
    try {
      // const response = await fetch("/api/auth/signin", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(user),
      // });
      // const data = await response.json();
      setLoading(true);
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        localStorage.setItem("user", response.user.uid);
        router.push("/");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Something went wrong. Please try again.");
    }
  }

  const { email, password } = user;

  return (
    <main className="bg-[#26313c] h-[calc(100vh-88px)] flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Signin
        </h1>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4"
        >
          <div>
            <label htmlFor="email" className="font-medium text-gray-700">
              Email
            </label>
            <Input
              className="mt-2 bg-gray-100 rounded-full border border-gray-300 px-4 py-2"
              type="email"
              value={email}
              name="email"
              id="email"
              onChange={(e) => handleChange(e)}
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
              name="password"
              value={password}
              onChange={(e) => handleChange(e)}
              placeholder="Enter your password"
            />
          </div>
          <Button
            onClick={signin}
            type="submit"
            className={`w-full mt-2 bg-red-600 rounded-full hover:bg-blue-700 text-white py-2`}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Signin
          </Button>
          <p>
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue-600">
              Signup
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
