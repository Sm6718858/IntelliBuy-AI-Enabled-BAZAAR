import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../AdminMenu";

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState(false);

  const token = localStorage.getItem("token");

  const getCategories = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/get-category`
    );
    setCategories(data.categories);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", photo);

      const uploadRes = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload-product-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = uploadRes.data.imageUrl;

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-product`,
        {
          name,
          description,
          price,
          quantity,
          category,
          shipping,
          image: imageUrl,
        }
      );

      toast.success("Product Created");
      navigate("/dashboard/admin/products");
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

        <aside className="md:w-1/4 bg-white rounded-xl shadow-lg p-4 h-fit">
          <AdminMenu />
        </aside>

        <main className="md:w-3/4 bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <h1 className="md:text-xl font-bold mb-8 ml-2 text-center text-indigo-700 uppercase">
             Create New Product
          </h1>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">

            <div>
              <label className="font-semibold block mb-2">Category</label>
              <Select
                onChange={setCategory}
                className="w-full"
                size="large"
                placeholder="Select category"
              >
                {categories.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="font-semibold block mb-2">Shipping</label>
              <Select
                onChange={setShipping}
                className="w-full"
                size="large"
              >
                <Option value={false}>No</Option>
                <Option value={true}>Yes</Option>
              </Select>
            </div>

            <div>
              <label className="font-semibold block mb-2">Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">Price (₹)</label>
              <input
                type="number"
                placeholder="Enter price"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">Quantity</label>
              <input
                type="number"
                placeholder="Enter quantity"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
              {photo && (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="preview"
                  className="h-24 mt-3 rounded-lg border object-cover"
                />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold block mb-2">Description</label>
              <textarea
                rows="4"
                placeholder="Write product description..."
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                style={{borderRadius:'20px'}}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition w-[150px]"
              >
                 Create Product
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateProduct;
