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
      console.log(error);
      toast.error("Failed to load product");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-category`
      );
      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
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
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmDelete) return;

      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/delete-product/${id}`
      );

      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminMenu />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">
          Update Product
        </h1>

        <form
          onSubmit={handleUpdate}
          className="max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="block font-semibold mb-2">Category</label>
            <Select
              className="w-full"
              size="large"
              value={category}
              onChange={setCategory}
            >
              {categories.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Product Image</label>
            <div className="flex items-center gap-6">
              <label className="cursor-pointer w-40 h-40 border-2 border-dashed border-indigo-400 rounded-xl flex items-center justify-center">
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <img
                    src={image}
                    alt="product"
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </label>
              <p className="text-sm text-gray-500">
                Click image to change (JPG / PNG)
              </p>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Shipping</label>
            <Select
              className="w-full"
              size="large"
              value={shipping}
              onChange={setShipping}
            >
              <Option value={false}>No</Option>
              <Option value={true}>Yes</Option>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700"
            >
              UPDATE PRODUCT
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600"
            >
              DELETE PRODUCT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
