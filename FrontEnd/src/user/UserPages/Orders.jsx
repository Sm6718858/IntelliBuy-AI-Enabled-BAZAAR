import React, { useState, useEffect } from "react";
import UserMenu from "../UserMenu";
import axios from "axios";
import { useAuth } from "../../Context/Auth";
import moment from "moment";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const statusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Canceled":
        return "bg-red-100 text-red-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

        <aside className="md:w-1/4 bg-white rounded-xl shadow-lg p-4 h-fit">
          <UserMenu />
        </aside>

        <main className="md:w-3/4 bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            🧾 Your Orders
          </h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500">
              You haven't placed any orders yet.
            </p>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border rounded-lg overflow-hidden">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="p-3 text-left">Order ID</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Payment</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Items</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-gray-50">
                        <td className="p-3">{o.orderId}</td>
                        <td className="p-3">
                          {moment(o.createdAt).format("DD/MM/YYYY")}
                        </td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            o.payStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : o.payStatus === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {o.payStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(o.orderStatus)}`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-indigo-600">
                          ₹{o.amount}
                        </td>
                        <td className="p-3 space-y-2">
                          {o.cartItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <img
                                src={`${import.meta.env.VITE_API_BASE_URL}/api/product-photo/${item._id}`}
                                className="w-10 h-10 object-cover rounded border"
                              />
                              <div>
                                <div className="text-sm font-medium">
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ₹{item.price}
                                </div>
                              </div>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4">
                {orders.map((o) => (
                  <div
                    key={o._id}
                    className="bg-white border rounded-xl shadow-md p-4"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{o.orderId}</span>
                      <span className="text-sm text-gray-500">
                        {moment(o.createdAt).format("DD MMM YYYY")}
                      </span>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColor(o.orderStatus)}`}>
                        {o.orderStatus}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        o.payStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {o.payStatus.toUpperCase()}
                      </span>
                    </div>

                    <p className="font-bold text-indigo-600 mb-2">
                      Amount: ₹{o.amount}
                    </p>

                    <div className="space-y-2">
                      {o.cartItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/api/product-photo/${item._id}`}
                            className="w-12 h-12 object-cover rounded border"
                          />
                          <div>
                            <div className="font-medium text-sm">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ₹{item.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Orders;
