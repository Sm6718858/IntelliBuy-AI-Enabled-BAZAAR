import React, { useState } from "react";
import { useCart } from "../Context/Cart";
import { useAuth } from "../Context/Auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      const total = cart.reduce((acc, item) => acc + item.price, 0);
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch {
      return "₹0";
    }
  };

  const removeCartItem = (pid) => {
    const updated = cart.filter((item) => item._id !== pid);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.success("Removed from cart");
  };

  const handlePayment = async () => {
    if (!auth?.token) return navigate("/login", { state: "/cart" });
    if (!auth?.user?.address)
      return navigate("/dashboard/user/profile", { state: { from: "/cart" } });

    try {
      setLoading(true);
      const total = cart.reduce((acc, item) => acc + item.price, 0);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/checkout`,
        {
          amount: total,
          cartItems: cart,
          userShipping: auth.user.address,
          userId: auth.user._id,
        }
      );

      const rzp = new window.Razorpay({
        key: "rzp_test_8UQCBcF3ea7T2Z",
        amount: data.amount * 100,
        currency: "INR",
        name: "Shivam E-Shop",
        order_id: data.orderId,
        handler: async (res) => {
          const verify = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/verify`,
            {
              ...res,
              cartItems: cart,
              userShipping: auth.user.address,
              userId: auth.user._id,
              paymentRecordId: data.paymentRecordId,
            }
          );

          if (verify.data.success) {
            toast.success("Payment successful ✨");
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
          }
        },
        theme: { color: "#6366f1" },
      });

      rzp.open();
    } catch {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-extrabold text-center text-indigo-700 mb-2">
          Hey {auth?.user?.name || "Guest"} 👋
        </h1>
        <p className="text-center text-gray-600 mb-10">
          {cart.length
            ? `You have ${cart.length} item${cart.length > 1 ? "s" : ""}`
            : "Your cart is empty"}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 p-3">
            {cart.map((item, index) => (
              <div
                key={item._id + index}
                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-5 flex flex-col sm:flex-row gap-5"
              >
                <div className="overflow-hidden rounded-2xl w-full sm:w-40 h-40">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/api/product-Photo/${item._id}`}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                      {item.description}
                    </p>
                    <p className="text-green-600 font-extrabold text-lg">
                      ₹ {item.price}
                    </p>
                  </div>

                  <button
                    onClick={() => removeCartItem(item._id)}
                    className="mt-3 w-fit px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-600 hover:text-white transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="backdrop-blur-xl bg-white/80 border border-white/50 rounded-3xl shadow-2xl p-6">
              <h2 className="text-2xl font-extrabold text-center mb-6 text-indigo-700">
                Cart Summary
              </h2>

              <div className="flex justify-between mb-3 text-gray-700">
                <span>Items</span>
                <span className="font-semibold">{cart.length}</span>
              </div>

              <div className="flex justify-between mb-6">
                <span>Total</span>
                <span className="font-extrabold text-green-600">
                  {totalPrice()}
                </span>
              </div>

              {auth?.user?.address ? (
                <div className="mb-4 bg-indigo-50 p-3 rounded-xl">
                  <p className="font-semibold text-sm mb-1">
                    Shipping Address
                  </p>
                  <p className="text-sm text-gray-700">
                    {auth.user.address}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() =>
                    navigate(
                      auth?.token
                        ? "/dashboard/user/profile"
                        : "/login",
                      { state: { from: "/cart" } }
                    )
                  }
                  className="w-full mb-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  {auth?.token ? "Add Address" : "Login to Checkout"}
                </button>
              )}

              <button
                disabled={loading || !cart.length || !auth?.user?.address}
                onClick={handlePayment}
                className={`w-full py-3 rounded-2xl font-bold text-white transition-all ${
                  loading || !cart.length || !auth?.user?.address
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]"
                }`}
              >
                {loading ? "Processing..." : "Make Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
