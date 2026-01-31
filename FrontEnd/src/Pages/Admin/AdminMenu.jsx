import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  const linkClass = ({ isActive }) =>
    `block ${
      isActive ? "bg-indigo-100 text-indigo-700 font-semibold" : ""
    }`;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-indigo-700">
        Admin Panel
      </h3>

      <ul className="list-group space-y-2">
        <NavLink
          to="/dashboard/admin/create-catagory"
          className={linkClass}
          style={{ textDecoration: "none" }}
        >
          <li className="list-group-item p-2 rounded hover:bg-blue-100 transition">
            Create Category
          </li>
        </NavLink>

        <NavLink
          to="/dashboard/admin/create-product"
          className={linkClass}
          style={{ textDecoration: "none" }}
        >
          <li className="list-group-item p-2 rounded hover:bg-blue-100 transition">
            Create Product
          </li>
        </NavLink>

        <NavLink
          to="/dashboard/admin/products"
          className={linkClass}
          style={{ textDecoration: "none" }}
        >
          <li className="list-group-item p-2 rounded hover:bg-blue-100 transition">
            Products
          </li>
        </NavLink>

        <NavLink
          to="/dashboard/admin/AdminOrders"
          className={linkClass}
          style={{ textDecoration: "none" }}
        >
          <li className="list-group-item p-2 rounded hover:bg-blue-100 transition">
            Orders
          </li>
        </NavLink>

        <NavLink
          to="/dashboard/admin/users"
          className={linkClass}
          style={{ textDecoration: "none" }}
        >
          <li className="list-group-item p-2 rounded hover:bg-blue-100 transition">
            Users
          </li>
        </NavLink>
      </ul>
    </div>
  );
};

export default AdminMenu;
