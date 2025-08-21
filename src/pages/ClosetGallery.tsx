import { useState } from "react";
import { Link } from "react-router-dom";
import { useClothing } from "../context/ClothingContext";
import ClothingModal from "../components/ClothingModal";
import "../styles/ClosetGallery.css";

interface ClothingItem {
  id: number;
  name: string;
  image: string;
  category?: string;
  date?: string;
}

const categories = ["All", "Tops", "Bottoms", "Dresses", "Winter"];

export default function ClosetGallery() {
  const { clothes } = useClothing();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalItem, setModalItem] = useState<ClothingItem | null>(null);

  const filteredClothes = clothes.filter((item: ClothingItem) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCardClick = (item: ClothingItem) => setModalItem(item);
  const closeModal = () => setModalItem(null);

  return (
    <div className="closet-page">
      <div className="closet-banner">
        <img
          src="https://cdn.pixabay.com/photo/2020/11/03/21/25/closet-5711161_1280.jpg"
          alt="Closet"
          className="closet-banner-image"
        />
        <div className="closet-banner-text">
          <h2>Welcome to Your Closet</h2>
          <p>Browse, manage & showcase your sustainable fashion</p>
        </div>
      </div>

      <div className="closet-search">
        <input
          type="text"
          placeholder="Search clothes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="closet-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredClothes.length === 0 ? (
        <p className="no-results">No items found. Try a different search or category.</p>
      ) : (
        <div className="closet-grid">
          {filteredClothes.map((item) => (
            <div
              key={item.id}
              className="closet-card"
              onClick={() => handleCardClick(item)}
            >
              <img src={item.image} alt={item.name} className="closet-image" />
              <p className="closet-name">{item.name}</p>
              <div className="closet-meta">
                <span className="closet-tag">{item.category || "Uncategorized"}</span>
                <span className="closet-date">
                  {new Date(item.date || Date.now()).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/upload" className="closet-add-btn">+</Link>

      <div className="closet-nav">
        <Link to="/home">Home</Link>
        <Link to="/closet" className="active">Closet</Link>
        <Link to="/swap">Swap</Link>
        <Link to="/my-swaps">My Swaps</Link>
        <Link to="/profile">Profile</Link>
      </div>

      {modalItem && <ClothingModal item={modalItem} onClose={closeModal} />}
    </div>
  );
}