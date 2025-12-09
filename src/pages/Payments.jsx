import { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, DollarSign } from "lucide-react";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get("/admin/payments");
        setPayments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payments History</h1>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-gray-400 font-medium">User</th>
                <th className="p-4 text-gray-400 font-medium">Amount</th>
                <th className="p-4 text-gray-400 font-medium">Date</th>
                <th className="p-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <CreditCard size={14} />
                      </div>
                      <span className="text-white">
                        {payment.user?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 ml-11">
                      {payment.user?.email}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white">
                    ${payment.amount}
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && !loading && (
                <tr>
                  <td colspan="4" className="p-8 text-center text-gray-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
