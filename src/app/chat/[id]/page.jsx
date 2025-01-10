"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/services/firebase";
import {
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const chatId = location.pathname.replace("/chat/", "");
  const senderId = localStorage.getItem("user");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSender, setIsSender] = useState(false);
  const [receiverId, setReceiverId] = useState("");

  function fetchChat() {
    const unsubscribe = onSnapshot(
      doc(db, "messages", chatId),
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
    if (chatId) {
      fetchChat();
    }
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const newMessageData = {
      content: newMessage,
      createdAt: new Date(),
      senderId,
      receiverId,
    };

    try {
      const chatDocRef = doc(db, "messages", chatId);
      await updateDoc(chatDocRef, {
        messages: arrayUnion(newMessageData),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setNewMessage("");
  };

  console.log("SW isSender", isSender);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="space-y-4 mb-4">
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
        <Button
          disabled={!newMessage}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
