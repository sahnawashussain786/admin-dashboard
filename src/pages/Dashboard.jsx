import { useEffect, useState } from "react";
import axios from "axios";
import { Users, DollarSign, Mail, UserPlus, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-500/10`}>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const fetchStats = async (retryCount = 0) => {
      try {
        setError(null);
        const { data } = await axios.get("/admin/stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);

        // Handle 429 rate limit errors with exponential backoff
        if (error.response?.status === 429 && retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          setRetrying(true);
          setError(`Rate limited. Retrying in ${delay / 1000} seconds...`);
          setTimeout(() => {
            setRetrying(false);
            fetchStats(retryCount + 1);
          }, delay);
          return;
        }

        // Handle other errors
        if (error.response?.status === 429) {
          setError("Too many requests. Please try again in a few minutes.");
        } else if (!error.response) {
          setError(
            "Unable to connect to server. Please check your internet connection."
          );
        } else {
          setError("Failed to load dashboard statistics. Please try again.");
        }
      } finally {
        if (!retrying) {
          setLoading(false);
        }
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-white">Loading stats...</div>;
  if (error)
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-400 p-6 rounded-xl">
        <h3 className="font-bold mb-2">Error Loading Dashboard</h3>
        <p>{error}</p>
        {!retrying && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-400 mt-2">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue || 0}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Subscribers"
          value={stats?.totalSubscribers || 0}
          icon={UserPlus}
          color="purple"
        />
        <StatCard
          title="Messages"
          value={stats?.totalMessages || 0}
          icon={Mail}
          color="orange"
        />
      </div>

      {/* Simple Chart */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Analytics
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Users", value: stats?.totalUsers || 0 },
                { name: "Subscribers", value: stats?.totalSubscribers || 0 },
                { name: "Messages", value: stats?.totalMessages || 0 },
                { name: "Payments", value: stats?.recentPayments || 0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
