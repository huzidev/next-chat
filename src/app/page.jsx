"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  const currentId = localStorage.getItem('user');
  console.log("SW currentID", currentId);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg">
            <CardHeader className="font-bold">
              {user.username || "Anonymous"}
            </CardHeader>
            <CardContent>
              <p>Email: {user.email}</p>
              <div className="mt-4 flex space-x-2">
                {currentId !== user.id && (
                  <Button
                    onClick={() => router.push(`/chat/${user.id}`)}
                    variant="default"
                  >
                    Open Chat
                  </Button>
                )}
                <Button
                  onClick={() => router.push(`/user/${user.id}`)}
                  variant="outline"
                >
                  {currentId === user.id ? "Edit Profile" : "View Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
