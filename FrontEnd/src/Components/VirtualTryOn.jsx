import { useState } from "react";
import axios from "axios";

const VirtualTryOn = ({ productId }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTryOn = async () => {
    if (!file) {
      setError("Please upload a full body image");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("productId", productId);
      formData.append("size", "M");

      const { data } = await axios.post(
        "/api/ai/try-on",
        formData
      );

      setResult(data.tryOnImage);
    } catch (err) {
      setError(
        err.response?.data?.message || "Try-on failed, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400 , marginTop: 80}}>
      <h3>AI Virtual Try-On</h3>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleTryOn} disabled={loading}>
        {loading ? "Generating..." : "Try Now"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && <p>AI is generating your try-on preview…</p>}

      {result && (
        <img
          src={result}
          alt="try-on"
          width="300"
          style={{ marginTop: 10 }}
        />
      )}
    </div>
  );
};

export default VirtualTryOn;
