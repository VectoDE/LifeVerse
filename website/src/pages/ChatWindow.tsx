"use client";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

interface ChatWindowProps {
    chatId: string;
    socket: Socket;
}

export default function ChatWindow({ chatId, socket }: ChatWindowProps) {
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Join the chat (private or group chat)
        socket.emit(chatId.startsWith("group") ? "join-group" : "join", chatId);

        // Receive messages
        socket.on("private-message", (data) => {
            if (data.from === chatId) {
                setMessages((prev) => [...prev, { sender: data.from, text: data.message }]);
            }
        });

        socket.on("group-message", (data) => {
            setMessages((prev) => [...prev, { sender: data.from, text: data.message }]);
        });

        return () => {
            socket.off("private-message");
            socket.off("group-message");
        };
    }, [chatId, socket]);

    const sendMessage = () => {
        if (!message.trim()) return;

        if (chatId.startsWith("group")) {
            socket.emit("group-message", { groupName: chatId, message });
        } else {
            socket.emit("private-message", { to: chatId, message });
        }

        setMessages([...messages, { sender: "Me", text: message }]);
        setMessage("");
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 border rounded-md bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.sender === "Me" ? "text-right" : "text-left"}`}>
                        <span className="font-semibold">{msg.sender}: </span>
                        <span>{msg.text}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex">
                <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                    onClick={sendMessage} 
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
}