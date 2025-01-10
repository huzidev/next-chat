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

  console.log("SW id", id);
  console.log("SW params for messages", params);
  

  function fetchChat() {
    const unsubscribe = onSnapshot(
      doc(db, "messages", id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setMessages(data.messages || []);
          setIsSender(data.senderId === senderId || data.receiverId === senderId);
          setReceiverId(data.senderId === senderId ? data.senderId : data.receiverId);
        }}
    );
    
    // Update messgae read status
    return () => unsubscribe();
  }

  useEffect(() => {
    if (id) {
      fetchChat();
      setLoading(false);
    }
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
        <Button variant="plain" className="p-0 pr-2" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <h1>
          Chat
        </h1>
      </div>
      <h1 className="text-2xl font-bold mb-4"></h1>
      <div className="space-y-4 mb-4">
        {loading &&
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className=" h-[30px] rounded-full" />
          ))}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              isSender ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <p>
              <strong>{isSender ? "You" : "User"}:</strong> {message.content}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(message.createdAt.seconds * 1000).toLocaleString()}
            </p>
          </div>
        ))}
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
