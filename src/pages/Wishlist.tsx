import { useState } from "react";
import "../styles/Wishlist.css";

interface WishlistItem {
  id: number;
  name: string;
  image: string;
}

export default function Wishlist() {
  const [wishlist] = useState<WishlistItem[]>([]); // Replace with actual context if needed

  return (
    <div className="wishlist-page">
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="empty-text">No items in your wishlist.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <img src={item.image} alt={item.name} className="wishlist-image" />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
