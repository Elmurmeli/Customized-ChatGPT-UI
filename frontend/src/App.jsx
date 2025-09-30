import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import InputBox from "./components/InputBox";

function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you today?" }
  ]);

const sendMessage = async (text) => {
  setMessages(prev => [...prev, { role: "user", content: text }]);

  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, { role: "user", content: text }] })
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message || { role: "assistant", content: "⚠️ No response from server" };
    setMessages(prev => [...prev, reply]);

  } catch (err) {
    setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Error: " + err.message }]);
  }
};

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ChatWindow messages={messages} />
      <InputBox onSend={sendMessage} />
    </div>
  );
}

export default App;