import { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare } from "lucide-react";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get("/admin/messages");
        setMessages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Messages</h1>

      <div className="grid grid-cols-1 gap-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-gray-900 bordered border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">
                    {msg.name || "Anonymous"}
                  </h3>
                  <p className="text-sm text-gray-400">{msg.email}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-300 bg-gray-950 p-4 rounded-lg">
              {msg.message}
            </p>
          </div>
        ))}
        {messages.length === 0 && !loading && (
          <div className="text-gray-500 text-center py-8">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
