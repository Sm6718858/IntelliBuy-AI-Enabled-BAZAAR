import React, { useEffect, useState } from "react";
import AdminMenu from "../AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../../Components/Form/CategoryForm";
import { Modal } from "antd";
import { useAuth } from "../../../Context/Auth";

const CreateCatagory = () => {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-category`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      setCategories(data.categories || []);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-category`,
        { name },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      if (data?.category) {
        setCategories((prev) => [...prev, data.category]);
        setName("");
        toast.success("Category added");
      }
    } catch {
      toast.error("Create failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/update-category/${selected._id}`,
        { name: updatedName },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      if (data?.category) {
        setCategories((prev) =>
          prev.map((c) => (c._id === selected._id ? data.category : c))
        );
        setVisible(false);
        setSelected(null);
        setUpdatedName("");
        toast.success("Category updated");
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/delete-category/${id}`,
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Category deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

        <aside className="md:w-1/4 bg-white rounded-xl shadow-lg p-4 h-fit">
          <AdminMenu />
        </aside>

        <main className="md:w-3/4">
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-10">
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-center">
              Manage Categories
            </h1>

            <div className="max-w-md mx-auto mb-10">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>

            <div className="hidden md:block overflow-x-auto border rounded-xl">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {cat.name}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(cat.name);
                            setSelected(cat);
                          }}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="border rounded-xl p-4 shadow-sm bg-white"
                >
                  <div className="font-semibold text-lg mb-3">
                    {cat.name}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setVisible(true);
                        setUpdatedName(cat.name);
                        setSelected(cat);
                      }}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Modal
              open={visible}
              footer={null}
              onCancel={() => setVisible(false)}
              title="Edit Category"
            >
              <CategoryForm
                handleSubmit={handleUpdate}
                value={updatedName}
                setValue={setUpdatedName}
              />
            </Modal>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateCatagory;
