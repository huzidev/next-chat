"use client";
import EmptyState from "@/components/general/EmptyChat";
import Spinner from "@/components/general/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/services/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const defaultLoadingState = {
  state: false,
  type: null
}

export default function Home() {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState({
    state: true,
    type: 'fetching-users',
  });
  const currentId = localStorage.getItem("user");

  // Fetch all users from Firestore
  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setLoading(defaultLoadingState);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);


  async function handleOpenChat(receiverId) {
    try {
      setLoading({
        state: true,
        type: receiverId,
      });
      const q = query(
        collection(db, "messages"),
        where("senderId", "in", [currentId, receiverId]),
        where("receiverId", "in", [currentId, receiverId])
      );

      const querySnapshot = await getDocs(q);
      let chatExists = null;

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          chatExists = { id: doc.id, ...doc.data() };
        });
      }

      console.log("SW does chat exist:", chatExists);

      if (chatExists) {
        router.push(`/chat/${chatExists.id}`);
      } else {
        const newChatRef = await addDoc(collection(db, "messages"), {
          senderId: currentId,
          receiverId,
          createdAt: serverTimestamp(),
        });

        console.log("SW new chat created with ID:", newChatRef.id);

        router.push(`/chat/${newChatRef.id}`);
      }
    } catch (error) {
      console.error("Error handling chat:", error);
    }
  }

  const { type, state } = loading;

  if (state && type === 'fetching-users') {
    return <Spinner />;
  }

  if (users && !users.length) {
    return (
      <div className="h-[calc(100dvh-100px)]">
        <EmptyState message="No users found" />
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto max-w-[1200]">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      {users && !users.length && <EmptyState message="No users found" />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map((user) => {
          const { id, username, email } = user;
          const isUserLoggedIn = currentId === id;
          const openingChat = state && type === id;
          return (
            <Card key={id} className="hover:shadow-lg">
              <CardHeader className="font-bold">
                {username || "Anonymous"}
              </CardHeader>
              <CardContent>
                <p>Email: {email}</p>
                <div className="mt-4 flex space-x-2">
                  {currentId && (
                    <>
                      {!isUserLoggedIn && (
                        <Button
                          onClick={() => handleOpenChat(id)}
                          variant="default"
                          disabled={openingChat}
                        >
                          Open Chat
                          {openingChat && <Loader2 className="animate-spin" />}
                        </Button>
                      )}
                      <Button
                        onClick={() =>
                          router.push(
                            isUserLoggedIn
                              ? "/user/edit-profile"
                              : `/user/${id}`
                          )
                        }
                        variant="outline"
                      >
                        {isUserLoggedIn ? "Edit Profile" : "View Profile"}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
