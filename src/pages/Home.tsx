import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <h1 className="home-title">Your Smart Wardrobe</h1>
      <p className="home-subtitle">Make sustainable fashion your lifestyle ✨</p>

      <div className="card-grid">
        <Link to="/closet" className="home-card">
          <h3>👚 CLOSET</h3>
          <p>Manage your wardrobe</p>
        </Link>

        <Link to="/upload" className="home-card">
          <h3>📤 UPLOAD</h3>
          <p>Add new clothing</p>
        </Link>

        <Link to="/swap" className="home-card">
          <h3>🔁 SWAP</h3>
          <p>Explore exchange options</p>
        </Link>

        <Link to="/profile" className="home-card">
          <h3>👤 PROFILE</h3>
          <p>View profile & stats</p>
        </Link>

        <Link to="/wishlist" className="home-card">
          <h3>💖 WISHLIST</h3>
          <p>Save your favorites</p>
        </Link>

        <Link to="/myswaps" className="home-card">
          <h3>📦 MY SWAPS</h3>
          <p>Track swap status</p>
        </Link>

      </div>
    </div>
  );
}
