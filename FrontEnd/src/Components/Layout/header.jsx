import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../Hook/useCategory";
import { useCart } from "../../Context/Cart";
import { Badge } from "antd";
import { Menu, X } from "lucide-react";
import logo from "../../assets/Logo.jpg";

const Header = () => {
  const [cart] = useCart();
  const [auth, setAuth] = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const Category = useCategory();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout successful!");
    navigate("/login");
    setUserDropdownOpen(false);
  };

  const linkStyle = ({ isActive }) =>
  `px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
   ${
     isActive
       ? "text-white bg-blue-700 md:bg-blue-600"
       : "text-white hover:bg-blue-700 md:text-gray-700 md:hover:bg-blue-600 md:hover:text-white"
   }`;


  return (
    <header
      className="
        sticky top-0 z-50
        backdrop-blur-xl
        bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]
        md:bg-white md:backdrop-blur-0
        md:border-b md:border-gray-200
      "
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center justify-between w-full md:w-auto">
          <NavLink
            to="/"
            style={{ textDecoration: "none" }}
            className="flex items-center gap-2"
          >
            <img
              src={logo}
              alt="IntelliBuy"
              className="h-10 w-auto rounded-md"
            />
            <span className="text-white md:text-gray-900 text-2xl font-extrabold tracking-wide">
              IntelliBuy
            </span>
          </NavLink>


          <button
            className="text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div className="w-full md:w-80">
          <SearchInput />
        </div>

        <div
          className={`w-full md:w-auto flex-col md:flex md:flex-row gap-3 md:gap-5 items-center transition-all duration-300
          ${mobileMenuOpen ? "flex mt-4" : "hidden md:flex"}`}
        >
          <NavLink to="/home" className={linkStyle} style={{ textDecoration: "none" }}>
            Home
          </NavLink>

          <div className="relative">
            <button
              onClick={() => {
                setCategoryDropdownOpen(!categoryDropdownOpen);
                setUserDropdownOpen(false);
              }}
              className="
                  px-4 py-2 font-medium text-sm transition
                  text-white hover:bg-orange-500
                  md:text-gray-700 md:hover:bg-orange-500 md:rounded-4xl
                "
            >
              Categories ▾
            </button>

            {categoryDropdownOpen && (
              <div className="absolute left-0 mt-3 w-52 bg-white rounded-2xl shadow-xl overflow-hidden z-50" style={{ textDecoration: "none" }}>
                <Link
                style={{ textDecoration: "none" }}
                  to="/categories"
                  className="block px-4 py-3 text-sm hover:bg-gray-100"
                  onClick={() => setCategoryDropdownOpen(false)}
                >
                  All Categories
                </Link>
                {Category?.map((c) => (
                  <Link
                  style={{ textDecoration: "none" }}
                    key={c._id}
                    to={`/category/${c.slug}`}
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                    onClick={() => setCategoryDropdownOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {!auth.user ? (
            <>
              <NavLink to="/login" className={linkStyle} style={{ textDecoration: "none" }}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkStyle} style={{ textDecoration: "none" }}>
                Register
              </NavLink>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setCategoryDropdownOpen(false);
                }}
                className="
                  px-4 py-2 rounded-md font-medium transition
                  bg-white/10 text-white hover:bg-blue-800
                  md:bg-blue-5800 md:text-gray-800 md:hover:bg-blue-800
                "
              >
                {auth.user.name?.toUpperCase()} ▾
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl overflow-hidden z-50">
                  <NavLink
                  style={{ textDecoration: "none" }}
                    to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                    className="block px-4 py-3 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 hover:bg-orange-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <Badge count={cart?.length} showZero>
            <NavLink to="/cart" className={linkStyle} style={{ textDecoration: "none" }}>
              Cart
            </NavLink>
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default Header;
