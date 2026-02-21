import React, { useEffect, useState } from "react";
import { useSearch } from "../Context/Search";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../Context/Cart";
import toast from "react-hot-toast";
import axios from "axios";

const Search = () => {
  const [cart, setCart] = useCart();
  const [values, setValues] = useSearch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q");

  const fetchProducts = async (keyword) => {
  try {
    if (!keyword || keyword.trim() === "") return;

    setLoading(true);

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/search/${keyword}`
    );

    console.log("API DATA:", data);

    setValues({
      ...values,
      results: Array.isArray(data) ? data : [],
    });

  } catch (error) {
    console.error("Search error:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (query) {
      fetchProducts(query);
    }
  }, [query]);

  return (
    <div title="Search results">
      <div className="container">
        <div className="text-center">

          <h1>Search Results</h1>

          {loading && <h5>Loading products...</h5>}

          {!loading && (
            <h6>
              {Array.isArray(values?.results) &&
              values.results.length < 1
                ? "No Products Found"
                : `Found ${values?.results?.length || 0} products`}
            </h6>
          )}

          <div className="d-flex flex-wrap mt-4">

            {Array.isArray(values?.results) &&
              values.results.map((p) => (

              <div key={p._id} className="card m-2" style={{ width: "18rem" }}>

                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Product+Image";
                  }}
                />

                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>

                  <p className="card-text">
                    {p.description?.substring(0, 30)}...
                  </p>

                  <p className="card-text">₹ {p.price}</p>

                  <button
                    className="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>

                  <button
                    className="btn btn-secondary ms-1"
                    onClick={() => {
                      setCart((prev) => [...prev, p]);
                      toast.success("Added to cart");
                    }}
                  >
                    ADD TO CART
                  </button>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Search;