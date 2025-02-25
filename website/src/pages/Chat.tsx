"use client";
import { useState } from "react";
import io, { Socket } from "socket.io-client";

// Connect to the server (replace the URL with your backend API)
const socket: Socket = io("https://your-backend-url.com", {
    withCredentials: true
});

export default function Chat() {
    const [chats, setChats] = useState<{ id: string; name: string; type: "private" | "group" }[]>([
        { id: "user123", name: "Alice", type: "private" },
        { id: "user456", name: "Bob", type: "private" },
        { id: "group1", name: "Gaming Group", type: "group" },
        { id: "group2", name: "Developers", type: "group" }
    ]);

    const [activeChat, setActiveChat] = useState<string | null>(null);

    return (
        <div className="flex h-screen">
            {/* Chat List */}
            <div className="w-1/4 bg-gray-100 p-4 border-r">
                <h2 className="text-xl font-bold">Chats</h2>
                {chats.map(chat => (
                    <div 
                        key={chat.id} 
                        className="p-3 bg-white shadow-sm rounded-md my-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => setActiveChat(chat.id)}
                    >
                        <span className="font-semibold">{chat.name}</span> 
                        <small className="ml-2 text-gray-500">({chat.type})</small>
                    </div>
                ))}
            </div>

            {/* Active Chat */}
            <div className="w-3/4 p-4">
                {activeChat ? (
                    <ChatWindow chatId={activeChat} socket={socket} />
                ) : (
                    <p className="text-gray-500">Select a chat...</p>
                )}
            </div>
        </div>
    );
}