import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useClothing } from "../context/ClothingContext";
import { generateClothingDescription } from "../utils/genAiDescription";
import "../styles/UploadClothing.css";

export default function UploadClothing() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { addClothing } = useClothing();
  const navigate = useNavigate();

  const tagList = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const resizeImage = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => reject(new Error("Could not read image file."));
      reader.onload = () => {
        const image = new Image();

        image.onerror = () => reject(new Error("Could not load image file."));
        image.onload = () => {
          const maxSize = 900;
          const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);

          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error("Could not process image."));
            return;
          }

          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };

        image.src = String(reader.result);
      };

      reader.readAsDataURL(file);
    });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedImage = await resizeImage(file);
      setImagePreview(compressedImage);
    } catch {
      toast.error("Could not prepare that image. Try another file.");
      e.target.value = "";
    }
  };

  const handleGenerateDescription = async () => {
    if (!name.trim()) {
      toast.error("Add the clothing name first.");
      return "";
    }

    setIsGenerating(true);

    try {
      const generated = await generateClothingDescription({
        name,
        category,
        color,
        tags: tagList,
      });
      setDescription(generated);
      toast.success("AI description generated.");
      return generated;
    } catch {
      toast.error("Could not generate a description.");
      return "";
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !name.trim()) {
      toast.error("Please provide both image and name.");
      return;
    }

    setIsUploading(true);

    try {
      const finalDescription = description.trim() || (await handleGenerateDescription());

      const newItem = {
        id: Date.now(),
        name: name.trim(),
        image: imagePreview,
        category: category.trim() || "Uncategorized",
        color: color.trim(),
        tags: tagList,
        notes: finalDescription,
        date: new Date().toISOString(),
      };

      await addClothing(newItem);
      toast.success("Clothing uploaded.");
      navigate("/closet");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      toast.error(`Upload failed: ${message}`);
    } finally {
      setIsUploading(false);
    }
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
          placeholder="Category, e.g. Tops or Bottoms"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Color, e.g. Blue"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags, e.g. casual, denim, party"
        />
        <button
          className="ai-description-btn"
          type="button"
          onClick={handleGenerateDescription}
          disabled={isGenerating || isUploading}
        >
          {isGenerating ? "Generating..." : "Generate AI Description"}
        </button>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="AI-generated description will appear here"
          rows={5}
        />
        <button type="submit" disabled={isGenerating || isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

