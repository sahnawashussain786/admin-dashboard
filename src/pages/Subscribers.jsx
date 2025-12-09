import { useEffect, useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscribers = async (retryCount = 0) => {
      try {
        setError(null);
        const { data } = await axios.get("/admin/subscribers");
        setSubscribers(data);
      } catch (error) {
        console.error(error);

        if (error.response?.status === 429 && retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000;
          setError(`Rate limited. Retrying in ${delay / 1000} seconds...`);
          setTimeout(() => fetchSubscribers(retryCount + 1), delay);
          return;
        }

        setError(
          error.response?.status === 429
            ? "Too many requests. Please try again later."
            : "Failed to load subscribers. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-gray-400 font-medium">Email Address</th>
                <th className="p-4 text-gray-400 font-medium">
                  Subscribed Date
                </th>
                <th className="p-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {subscribers.map((sub) => (
                <tr
                  key={sub._id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="p-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Mail size={14} />
                    </div>
                    {sub.email}
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscribersPage;
