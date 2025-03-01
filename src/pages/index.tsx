import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket = io();

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("rooms", (updatedRooms) => {
      setRooms(updatedRooms);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  console.log(messages);

  const sendMessage = () => {
    if (room) {
      socket.emit("message", { room, message });
      setMessages((prev) => [...prev, { room, message }]);
      setMessage("");
    } else {
      alert("Please select a room.");
    }
  };

  const joinRoom = (roomName) => {
    setRoom(roomName);
    socket.emit("joinRoom", roomName);
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>

      <div>
        <h2>Rooms</h2>
        {rooms.map((roomName, index) => (
          <button key={index} onClick={() => joinRoom(roomName)}>
            {roomName}
          </button>
        ))}
        <input type="text" placeholder="Enter room name..." onChange={(e) => joinRoom(e.target.value)} />
      </div>

      <div>
        <h2>Messages in {room}</h2>
        {messages
          .filter((msg) => msg.room === room)
          .map((msg, index) => (
            <div key={index}>{msg.message}</div>
          ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ color: "black" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
