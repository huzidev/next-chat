"use client";

import Spinner from "@/components/general/Spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Messages() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("user");
  
  async function fetchMessages() {
    try {
      const senderQuery = query(
        collection(db, "messages"),
        where("senderId", "==", currentUserId)
      );

      const receiverQuery = query(
        collection(db, "messages"),
        where("receiverId", "==", currentUserId)
      );

      const senderSnapshot = await getDocs(senderQuery);
      const receiverSnapshot = await getDocs(receiverQuery);

      const fetchedMessages = [];
      senderSnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() });
      });
      receiverSnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() });
      });

      setMessages(fetchedMessages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }
  
  useEffect(() => {
    if (currentUserId)  {
      fetchMessages()
    };
  }, [currentUserId]);

  if (loading) {
    return <Spinner />;
  }

  if (!messages.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No messages found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto max-w-[1200]">
      <div className="flex gap-1 items-center mb-4" onClick={() => router.back()}>
        <ChevronLeft className="cursor-pointer" />
        <h1 className="text-2xl font-bold">Your Messages</h1>
      </div>
      <div className="space-y-4">
        {messages.reverse().map((message) => (
          <Card
            key={message.id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => router.push(`/chat/${message.id}`)}
          >
            <CardHeader>
              <h2 className="font-semibold text-lg">
                Conversation with{" "}
                {message.senderId === currentUserId
                  ? `User ${message.receiverId}`
                  : `User ${message.senderId}`}
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Last message: {message.content || "No messages yet"}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(message.updatedAt?.seconds * 1000).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
