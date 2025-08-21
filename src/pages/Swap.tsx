import { useSwap } from "../context/SwapContext";
import "../styles/Swap.css";

interface SwapItem {
  id: number;
  itemName: string;
  image: string;
  status: "pending" | "accepted" | "declined";
}

export default function Swap() {
  const { swapItems = [] } = useSwap();

  return (
    <div className="swap-page">
      <h2>Swap Requests</h2>
      {swapItems.length === 0 ? (
        <p className="empty-text">No swap requests yet.</p>
      ) : (
        <div className="swap-list">
          {swapItems.map((item: SwapItem) => (
            <div key={item.id} className="swap-card">
              <img src={item.image} alt={item.itemName} className="swap-image" />
              <div className="swap-info">
                <h4>{item.itemName}</h4>
                <p>
                  Status: <span className={`status ${item.status}`}>{item.status}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
