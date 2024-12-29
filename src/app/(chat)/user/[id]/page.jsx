'use client';

import { Button } from "@/components/ui/button";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const router = useRouter();
  const id = location.pathname.replace("/user/", "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", id); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          console.error("No such user found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  console.log("SW user", user);
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{user.username}'s Profile</h1>
      <div className="mb-4">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Joined:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
      <Button
        onClick={() => router.push(`/chat/${id}`)} // Redirect to chat page
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Send Message
      </Button>
    </div>
  );
}
