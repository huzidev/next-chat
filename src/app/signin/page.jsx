import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <main className="bg-[#26313c] h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Signin</h1>
        <form className="flex flex-col gap-4">
          {/* Email Field */}
          <label htmlFor="email" className="font-medium text-gray-700">
            Email
          </label>
          <Input
            className="mt-2 mb-4 bg-gray-100 rounded-full border border-gray-300 px-4 py-2"
            type="email"
            id="email"
            placeholder="Enter your email"
          />

          {/* Password Field */}
          <label htmlFor="password" className="font-medium text-gray-700">
            Password
          </label>
          <Input
            className="mt-2 mb-4 bg-gray-100 rounded-full border border-gray-300 px-4 py-2"
            type="password"
            id="password"
            placeholder="Enter your password"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-6 bg-red-600 rounded-full hover:bg-blue-700 text-white py-2"
          >
            Signin
          </Button>
          
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          @2024 All rights reserved
        </p>
      </div>
    </main>
  );
}
