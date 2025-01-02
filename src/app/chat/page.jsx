"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/services/firebase";
import { useSocket } from "@/services/socket";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const router = useRouter();
  const { userId } = router.query;
  const currentId = localStorage.getItem("user");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { sendMessage } = useSocket();

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(
        collection(db, "messages"),
        where("senderId", "in", [currentId, userId]),
        where("receiverId", "in", [currentId, userId]),
        orderBy("createdAt", "asc")
      );
      const querySnapshot = await getDocs(q);
      const loadedMessages = querySnapshot.docs.map((doc) => doc.data());
      setMessages(loadedMessages);
    };

    fetchMessages();
  }, [currentId, userId]);

  const handleSendMessage = () => {
    if (!newMessage) return;

    sendMessage({
      senderId: currentId,
      receiverId: userId,
      content: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat with User {userId}</h1>
      <div className="space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.senderId === currentId ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <p>
              <strong>
                {message.senderId === currentId ? "You" : "User"}:
              </strong>{" "}
              {message.content}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(message.createdAt?.seconds * 1000).toLocaleString()}
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
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
}
