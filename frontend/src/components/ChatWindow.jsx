function ChatWindow({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`mb-2 p-2 rounded-xl max-w-md ${
            msg.role === "user"
              ? "bg-blue-500 text-white self-end ml-auto"
              : "bg-gray-300 text-black"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;