import { useState } from "react";
import { Link } from "react-router-dom";
import { useClothing, type ClothingItem } from "../context/ClothingContext";
import ClothingModal from "../components/ClothingModal";
import { getRecommendations, getSmartSuggestions } from "../utils/recommendations";
import "../styles/ClosetGallery.css";

const categories = ["All", "Tops", "Bottoms", "Dresses", "Winter"];

const demoClothes: ClothingItem[] = [
  {
    id: 9001,
    name: "Blue Casual Shirt",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
    category: "Tops",
    color: "Blue",
    tags: ["casual", "cotton", "daily"],
    date: new Date().toISOString(),
  },
  {
    id: 9002,
    name: "Black Denim Jeans",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    category: "Bottoms",
    color: "Black",
    tags: ["casual", "denim", "daily"],
    date: new Date().toISOString(),
  },
  {
    id: 9003,
    name: "White Party Top",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=600&q=80",
    category: "Tops",
    color: "White",
    tags: ["party", "evening", "light"],
    date: new Date().toISOString(),
  },
  {
    id: 9004,
    name: "Green Winter Jacket",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80",
    category: "Winter",
    color: "Green",
    tags: ["winter", "casual", "layering"],
    date: new Date().toISOString(),
  },
];

const normalize = (value = "") => value.trim().toLowerCase();

export default function ClosetGallery() {
  const { clothes } = useClothing();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalItem, setModalItem] = useState<ClothingItem | null>(null);
  const visibleClothes = clothes.length > 0 ? clothes : demoClothes;
  const isDemoMode = clothes.length === 0;
  const smartSuggestions = getSmartSuggestions(visibleClothes);

  const filteredClothes = visibleClothes.filter((item: ClothingItem) => {
    const matchesCategory =
      selectedCategory === "All" || normalize(item.category) === normalize(selectedCategory);
    const matchesSearch = normalize(item.name).includes(normalize(searchTerm));
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

      <section className="recommendation-panel" aria-labelledby="recommendation-title">
        <div>
          <p className="recommendation-kicker">Content-based filtering</p>
          <h3 id="recommendation-title">Smart outfit and swap suggestions</h3>
          <p>
            Items are converted into feature vectors using category, color, and
            tags, then ranked with similarity matching.
          </p>
          {isDemoMode && (
            <p className="demo-note">
              Demo closet loaded so the recommendation model is visible before upload.
            </p>
          )}
        </div>

        {smartSuggestions.length > 0 ? (
          <div className="recommendation-grid">
            {smartSuggestions.map((suggestion) => (
              <button
                className="recommendation-card"
                key={`${suggestion.baseItem.id}-${suggestion.item.id}`}
                type="button"
                onClick={() => setModalItem(suggestion.baseItem)}
              >
                <span className="recommendation-score">
                  {Math.round(suggestion.score * 100)}% match
                </span>
                <div className="recommendation-pair">
                  <img src={suggestion.baseItem.image} alt={suggestion.baseItem.name} />
                  <img src={suggestion.item.image} alt={suggestion.item.name} />
                </div>
                <strong>
                  {suggestion.baseItem.name} + {suggestion.item.name}
                </strong>
                <small>{suggestion.reasons.join(", ")}</small>
              </button>
            ))}
          </div>
        ) : (
          <p className="recommendation-empty">
            Add color and tags while uploading items to unlock smarter recommendations.
          </p>
        )}
      </section>

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
        <Link to="/myswaps">My Swaps</Link>
        <Link to="/profile">Profile</Link>
      </div>

      {modalItem && (
        <ClothingModal
          item={modalItem}
          onClose={closeModal}
          recommendations={getRecommendations(modalItem, visibleClothes)}
          onSelectRecommendation={setModalItem}
        />
      )}
    </div>
  );
}
