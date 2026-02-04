import React, { useState, useEffect } from "react";
import AdminMenu from "../AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-products`
      );
      setProducts(data.products);
    } catch (error) {
      toast.error("❌ Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

        <aside className="md:w-1/4 bg-white rounded-xl shadow-lg p-4 h-fit">
          <AdminMenu />
        </aside>

        <main className="md:w-3/4">
          <div className="bg-white rounded-2xl shadow-xl md:p-8 p-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">
                📦 All Products
              </h1>
              <span className="text-sm text-gray-500">
                Total: {products.length}
              </span>
            </div>

            {products.length === 0 ? (
              <p className="text-center text-gray-500">
                No products found
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <Link
                    key={p._id}
                    to={`/dashboard/admin/product/${p.slug}`}
                    className="group"
                  >
                    <div className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-2xl transition p-8">
                      
                      <div className="h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300x300?text=Product+Image";
                          }}
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 truncate">
                          {p.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {p.description}
                        </p>

                        <div className="mt-4 text-blue-600 text-sm font-semibold">
                          Edit Product →
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
