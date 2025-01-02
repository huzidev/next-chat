"use client";

import Spinner from "@/components/Spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Messages() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("user");

  useEffect(() => {
    async function fetchMessages() {
      try {
        const q = query(
          collection(db, "messages"),
          where("users", "array-contains", currentUserId)
        );
        const querySnapshot = await getDocs(q);
        const fetchedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (currentUserId) fetchMessages();
  }, [currentUserId]);

  if (loading) {
      return <Spinner />
    }

  if (!messages.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No messages found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Messages</h1>
      <div className="space-y-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => router.push(`/chat/${message.id}`)}
          >
            <CardHeader>
              <h2 className="font-semibold text-lg">
                Conversation with{" "}
                {message.users.filter((id) => id !== currentUserId).join(", ")}
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Last message: {message.lastMessage || "No messages yet"}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(message.updatedAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
