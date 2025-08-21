import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClothing } from "../context/ClothingContext";
import "../styles/UploadClothing.css";

export default function UploadClothing() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const { addClothing } = useClothing();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !name.trim()) {
      alert("Please provide both image and name");
      return;
    }

    const newItem = {
      id: Date.now(),
      name,
      image: imagePreview,
      category,
      date: new Date().toISOString(),
    };
    addClothing(newItem);
    navigate("/closet");
  };

  return (
    <div className="upload-form">
      <h2>Upload Clothing</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        {imagePreview && <img src={imagePreview} alt="Preview" className="preview" />}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter clothing name"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category (optional)"
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

