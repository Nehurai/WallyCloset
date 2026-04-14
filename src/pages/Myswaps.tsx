import { useSwap } from "../context/SwapContext";
import "../styles/Myswaps.css";

interface SwapItem {
  id: number;
  itemName: string;
  image: string;
  status: "pending" | "accepted" | "declined";
}

export default function MySwaps() {
  const { swapItems = [] } = useSwap();

  return (
    <div className="my-swaps-page">
      <h2>My Swaps</h2>
      {swapItems.length === 0 ? (
        <p className="empty-text">You haven't made any swaps yet.</p>
      ) : (
        <div className="swap-list">
          {swapItems.map((swap: SwapItem) => (
            <div key={swap.id} className="swap-card">
              <img src={swap.image} alt={swap.itemName} className="swap-image" />
              <div className="swap-info">
                <h4>{swap.itemName}</h4>
                <p>
                  Status: <span className={`status ${swap.status}`}>{swap.status}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
