import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import InputBox from "./components/InputBox";

function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you today?" }
  ]);

const sendMessage = async (text) => {
  const newMessages = [...messages, { role: "user", content: text }];
  setMessages(newMessages);

  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();

    if (data?.choices?.[0]?.message) {
      const reply = data.choices[0].message;
      setMessages([...newMessages, reply]);
    } else {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "No response from API." },
      ]);
    }
  } catch (err) {
    setMessages([
      ...newMessages,
      { role: "assistant", content: "Error: " + err.message },
    ]);
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