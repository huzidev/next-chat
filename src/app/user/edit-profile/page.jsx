"use client";

import Spinner from "@/components/general/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProfile() {
  const currentId = localStorage.getItem("user");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!currentId) return;
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", currentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(data);
          setFormData({
            username: data.username || "",
            email: data.email || "",
          });
        } else {
          console.error("User not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!currentId) return;
    setUpdating(true);
    try {
      const docRef = doc(db, "users", currentId);
      await updateDoc(docRef, {
        username: formData.username,
        email: formData.email,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  const isDisabled =
    formData.username === user?.username && formData.email === user?.email;

  return (
    <div className="p-6 mx-auto max-w-[1200]">
      <h1 className="text-2xl font-bold mb-4">
        <Button variant="primary" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        Edit Profile
      </h1>
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="username">
            Username
          </label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </div>
        <Button
          onClick={handleUpdate}
          className="bg-blue-500 text-white hover:bg-blue-600"
          disabled={updating || isDisabled}
        >
          {updating ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </div>
  );
}
