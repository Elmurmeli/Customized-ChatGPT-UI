import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import InputBox from "./components/InputBox";

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (/*Initiate different styles for user and bot messages*/
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs p-3 rounded-2xl ${
          isUser  
            ? "bg-green-600 text-white rounded-br-none"
            : "bg-gray-700 text-gray-100 rounded-bl-none"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function App() {

  const [messages, setMessages] = useState([
    { /*Starting message*/
      role: "assistant",
      content: "👋 Hi! I’m your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);





const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Call backend (mock or real)
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const reply =
        data?.choices?.[0]?.message ??
        { role: "assistant", content: "⚠️ No response from API" };

      setMessages([...newMessages, reply]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 bg-gradient-to-r from-green-500 to-emerald-700 text-xl font-bold">
        ChatGPT Clone
      </header>

       {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <div className="text-gray-400 italic">Assistant is typing...</div>
        )}
      </main>

      
      {/* Input Box */}
      <footer className="p-4 bg-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg bg-gray-700 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`px-4 py-2 rounded-lg ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "..." : "Send"}
        </button>
      </footer>
      {/*<InputBox onSend={sendMessage} />*/}
    </div>
  );
}

export default App;