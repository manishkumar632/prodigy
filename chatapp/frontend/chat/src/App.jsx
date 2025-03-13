import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Chat from "./Chat";
import { logout } from "./api";

const App = () => {
    const [user, setUser] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${user}/`);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setUnreadCount(data.unread_count);
        };

        return () => socket.close();
    }, [user]);

    return (
        <Router>
          <div>
            {user && <p>Unread Messages: {unreadCount}</p>}
        </div>
            <nav>
                <Link to="/">Login</Link> | 
                <Link to="/register">Register</Link> | 
                {user && <button onClick={() => { logout(); setUser(null); }}>Logout</button>}
            </nav>
            <Routes>
                <Route path="/" element={<Login setUser={setUser} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat/:roomName" element={<Chat user={user} />} />
            </Routes>
        </Router>
    );
};

export default App;
