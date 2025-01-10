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

  async function fetchUserData(userId) {
    try {
      const userQuery = query(collection(db, "users"), where("id", "==", userId));
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        return userSnapshot.docs[0].data();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    return null;
  }

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
      for (const doc of senderSnapshot.docs) {
        const message = { id: doc.id, ...doc.data() };
        const receiverData = await fetchUserData(message.receiverId);
        fetchedMessages.push({
          ...message,
          receiverName: receiverData?.name || `User ${message.receiverId}`,
        });
      }

      for (const doc of receiverSnapshot.docs) {
        const message = { id: doc.id, ...doc.data() };
        const senderData = await fetchUserData(message.senderId);
        fetchedMessages.push({
          ...message,
          senderName: senderData?.name || `User ${message.senderId}`,
        });
      }

      console.log("Fetched messages:", fetchedMessages);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUserId) {
      fetchMessages();
    }
  }, [currentUserId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-4 mx-auto max-w-[1200px]">
      <div
        className="flex gap-1 items-center mb-4"
        onClick={() => router.back()}
      >
        <ChevronLeft className="cursor-pointer" />
        <h1 className="text-2xl font-bold">Your Messages</h1>
      </div>
      {!messages.length ? (
        <EmptyState message="No messages found" />
      ) : (
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
                    ? message.receiverName
                    : message.senderName}
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Last message: {message.content || "No messages yet"}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(
                    message.updatedAt?.seconds * 1000 || Date.now()
                  ).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
