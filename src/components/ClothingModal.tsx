import { useSwap } from "../context/SwapContext";
import "../styles/ClothingModal.css";
import toast from "react-hot-toast";

interface ClothingItem {
  id: number;
  name: string;
  image: string;
  category?: string;
  date?: string;
}

interface ClothingModalProps {
  item: ClothingItem;
  onClose: () => void;
}

export default function ClothingModal({ item, onClose }: ClothingModalProps) {
  const { requestSwap } = useSwap();

  const handleSwap = () => {
    requestSwap({
      id: Date.now(),
      itemName: item.name,
      image: item.image,
      status: "pending",
    });
    toast.success("Swap request sent!");
    onClose();
  };

  return (
    <div className="clothing-modal" onClick={onClose}>
      <div className="clothing-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h3>{item.name}</h3>
        <img src={item.image} alt={item.name} />
        <p>Category: {item.category || "Uncategorized"}</p>
        <p>
          Added on: {new Date(item.date || Date.now()).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <button className="swap-request-btn" onClick={handleSwap}>
          Request Swap
        </button>
      </div>
    </div>
  );
}
