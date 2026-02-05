import React, { useEffect, useState } from "react";
import AdminMenu from "../AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [categories, setCategories] = useState([]);
  const [id, setId] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [image, setImage] = useState("");

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/single-product/${slug}`
      );

      const p = data.product;
      setId(p._id);
      setName(p.name);
      setDescription(p.description);
      setPrice(p.price);
      setQuantity(p.quantity);
      setCategory(p.category?._id);
      setShipping(p.shipping);
      setImage(p.image);
    } catch (error) {
      toast.error("Failed to load product");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-category`
      );
      if (data?.success) setCategories(data.categories);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getSingleProduct();
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = image;

      if (photo) {
        const formData = new FormData();
        formData.append("image", photo);

        const uploadRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/upload-product-image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        imageUrl = uploadRes.data.imageUrl;
      }

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/update-product/${id}`,
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

      if (data.success) {
        toast.success("Product Updated");
        navigate("/dashboard/admin/products", { state: { refresh: true } });
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/delete-product/${id}`
      );
      toast.success("🗑 Product Deleted");
      navigate("/dashboard/admin/products");
    } catch (error) {
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
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <h1 className="text-2xl md:text-2xl font-bold mb-8">
               Update Product
            </h1>

            <form
              onSubmit={handleUpdate}
              className="space-y-6 max-w-3xl px-3 bg-white rounded-xl"
            >

              <div className="p-8">
                <label className="font-semibold block mb-2">Category</label>
                <Select
                  value={category}
                  onChange={setCategory}
                  size="large"
                  className="w-full"
                >
                  {categories.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="font-semibold block mb-2">Product Image</label>
                <label className="cursor-pointer w-44 h-44 border-2 border-dashed border-indigo-400 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={photo ? URL.createObjectURL(photo) : image}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Click image to replace
                </p>
              </div>

              <div>
                <label className="font-semibold block mb-2">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="font-semibold block mb-2">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="font-semibold block mb-2">Shipping</label>
                <Select
                  value={shipping}
                  onChange={setShipping}
                  size="large"
                  className="w-full"
                >
                  <Option value={false}>No</Option>
                  <Option value={true}>Yes</Option>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl"
                >
                  UPDATE
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl"
                >
                  DELETE
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateProduct;
