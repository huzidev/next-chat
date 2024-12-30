"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const router = useRouter();
  const id = location.pathname.replace("/user/", "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentId = localStorage.getItem("user");

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

  return (
    <div className="p-6 mx-auto max-w-[1200]">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {currentId === id ? "Yours Profile" : `${user.username}'s ` + 'Profile'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          {id === currentId ? (
            <Button
              onClick={() => router.push(`/edit-profile`)}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              onClick={() => router.push(`/chat/${id}`)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Send Message
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
