import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Search, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();
  const [promoteEmail, setPromoteEmail] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (retryCount = 0) => {
    try {
      setError(null);
      const { data } = await axios.get("/admin/users");
      setUsers(data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 429 && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        setError(`Rate limited. Retrying in ${delay / 1000} seconds...`);
        setTimeout(() => fetchUsers(retryCount + 1), delay);
        return;
      }

      setError(
        error.response?.status === 429
          ? "Too many requests. Please try again later."
          : "Failed to load users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/admin/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  const handlePromote = async (e) => {
    e.preventDefault();
    if (!promoteEmail) return;

    try {
      const { data } = await axios.put("/auth/promote", {
        email: promoteEmail,
      });
      alert(data.message);
      setPromoteEmail("");
      fetchUsers(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Failed to promote user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Users Management</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Promote Admin Form */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ShieldCheck className="text-purple-500" />
          Add New Admin
        </h3>
        <form onSubmit={handlePromote} className="flex gap-4">
          <input
            type="email"
            placeholder="Enter user email to promote"
            className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Promote
          </button>
        </form>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-gray-400 font-medium">Name</th>
                <th className="p-4 text-gray-400 font-medium">Email</th>
                <th className="p-4 text-gray-400 font-medium">Role</th>
                <th className="p-4 text-gray-400 font-medium">Joined Date</th>
                <th className="p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isAdmin
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {!user.isAdmin && (
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
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

export default UsersPage;
