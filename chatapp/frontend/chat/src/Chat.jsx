import React, { useState, useEffect } from "react";

const Chat = ({ roomName, user }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const socketUrl = `ws://127.0.0.1:8000/ws/chat/${roomName}/`;
    
    useEffect(() => {
        const socket = new WebSocket(socketUrl);
        
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        return () => socket.close();
    }, [roomName]);

    const sendMessage = () => {
        const socket = new WebSocket(socketUrl);
        socket.onopen = () => {
            socket.send(JSON.stringify({ message: newMessage }));
            setNewMessage("");
        };
    };

    const markMessagesAsRead = async () => {
        await axios.post(`http://127.0.0.1:8000/mark-read/${roomName}/`);
    };
    
    return (
        <div>
            <h2>Chat Room: {roomName}</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}><b>{msg.sender}:</b> {msg.message}</p>
                ))}
            </div>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
 