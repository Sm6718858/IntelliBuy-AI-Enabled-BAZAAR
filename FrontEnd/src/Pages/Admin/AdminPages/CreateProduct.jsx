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

  const getPresignedUrl = async (file) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/s3/presigned-url`,
      { fileType: file.type.split("/")[1] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  };

  const uploadToS3 = async (url, file) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type
      },
      body: file
    });

    if (!res.ok) {
      throw new Error("S3 upload failed");
    }

  };

  const handleCreate = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("image", photo);

    const uploadRes = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/upload-product-image`,
      formData,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
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
      },
      // { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Product Created");
    navigate("/dashboard/admin/products");
  } catch (err) {
    toast.error("Upload failed");
  }
};


  return (
    <div className="flex">
      <AdminMenu />
      <div className="p-6 w-full">
        <h2>Create Product</h2>

        <Select onChange={setCategory} className="w-full mb-3">
          {categories.map((c) => (
            <Option key={c._id} value={c._id}>
              {c.name}
            </Option>
          ))}
        </Select>

        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <textarea
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          onChange={(e) => setQuantity(e.target.value)}
        />

        <Select onChange={setShipping} className="w-full">
          <Option value={false}>No</Option>
          <Option value={true}>Yes</Option>
        </Select>

        <button onClick={handleCreate}>CREATE</button>
      </div>
    </div>
  );
};

export default CreateProduct;
