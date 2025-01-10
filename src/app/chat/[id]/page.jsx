"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/services/firebase";
import {
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const senderId = localStorage.getItem("user");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSender, setIsSender] = useState(false);
  const [receiverId, setReceiverId] = useState("");
  const router = useRouter();

  function fetchChat() {
    const unsubscribe = onSnapshot(
      doc(db, "messages", id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log("SW what is data on fetch", data);
          
          setMessages(data.messages || []);
          setIsSender(data.senderId === senderId || data.receiverId === senderId);
          setReceiverId(data.senderId === senderId ? data.senderId : data.receiverId);
          setLoading(false);
        }}
    );
    return () => unsubscribe()
  }

  useEffect(() => {
    fetchChat();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const newMessageData = {
      content: newMessage,
      createdAt: new Date(),
      senderId,
      receiverId,
    };

    try {
      const chatDocRef = doc(db, "messages", id);
      await updateDoc(chatDocRef, {
        messages: arrayUnion(newMessageData),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setNewMessage("");
  };
  
  return (
    <div className="py-6 max-w-[1200] mx-auto">
      <div className="flex items-center mb-4">
        <Button
          variant="plain"
          className="p-0 pr-2"
          onClick={() => router.back()}
        >
          <ChevronLeft />
        </Button>
        <h1>Chat</h1>
      </div>
      <h1 className="text-2xl font-bold mb-4"></h1>
      <div className="space-y-4 mb-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[30px] rounded-full" />
          ))
        ) : !messages.length ? (
          <div className="flex flex-col items-center justify-center h-full py-10">
            <div className="flex flex-col items-center">
              <svg
                className="w-16 h-16 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12h3m-3-4h3m-3 8h3m-6 4H7c-2.21 0-4-1.79-4-4V7c0-2.21 1.79-4 4-4h10c2.21 0 4 1.79 4 4v6.5M8 15h.01M12 15h.01M12 11h.01M8 11h.01M8 7h.01M12 7h.01M16 11h.01M16 7h.01"
                />
              </svg>
              <h1 className="mt-4 text-xl font-semibold text-gray-700">
                No messages found
              </h1>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isSender = message.senderId === currentUserId;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  isSender ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <p>
                  <strong>{isSender ? "You" : "User"}:</strong>{" "}
                  {message.content}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(message.createdAt.seconds * 1000).toLocaleString()}
                </p>
              </div>
            );
          })
        )}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button disabled={!newMessage} onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
}
