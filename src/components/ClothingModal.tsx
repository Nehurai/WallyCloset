import { useEffect, useMemo } from "react";
import { useSwap } from "../context/SwapContext";
import type { ClothingItem } from "../context/ClothingContext";
import type { Recommendation } from "../utils/recommendations";
import { buildFeatureVector } from "../utils/recommendations";
import "../styles/ClothingModal.css";
import toast from "react-hot-toast";

interface ClothingModalProps {
  item: ClothingItem;
  onClose: () => void;
  recommendations?: Recommendation[];
  onSelectRecommendation?: (item: ClothingItem) => void;
}

export default function ClothingModal({
  item,
  onClose,
  recommendations = [],
  onSelectRecommendation,
}: ClothingModalProps) {
  const { requestSwap } = useSwap();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const addedDate = useMemo(() => {
    const parsedDate = new Date(item.date || Date.now());

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently added";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [item.date]);

  const itemDetails = useMemo(
    () =>
      [
        { label: "Category", value: item.category || "Uncategorized" },
        { label: "Color", value: item.color },
        { label: "Tags", value: item.tags?.join(", ") },
        { label: "Added on", value: addedDate },
        { label: "Size", value: item.size },
        { label: "Condition", value: item.condition },
      ].filter((detail) => Boolean(detail.value)),
    [addedDate, item.category, item.color, item.condition, item.size, item.tags]
  );

  const featureVector = useMemo(() => buildFeatureVector(item), [item]);

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
      <section
        className="clothing-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clothing-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Close clothing details"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="clothing-modal-media">
          <img src={item.image} alt={item.name} loading="lazy" />
        </div>

        <div className="clothing-modal-details">
          <p className="clothing-modal-kicker">Closet item</p>
          <h3 id="clothing-modal-title">{item.name}</h3>

          <dl className="clothing-modal-meta">
            {itemDetails.map((detail) => (
              <div className="clothing-modal-meta-row" key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>

          {item.notes && <p className="clothing-modal-notes">{item.notes}</p>}

          <div className="feature-vector-panel">
            <span>Feature vector</span>
            <p>{featureVector.length ? featureVector.join(" + ") : "No features yet"}</p>
          </div>

          {recommendations.length > 0 && (
            <div className="modal-recommendations">
              <h4>Similar outfit matches</h4>
              {recommendations.map((recommendation) => (
                <button
                  className="modal-recommendation"
                  key={recommendation.item.id}
                  type="button"
                  onClick={() => onSelectRecommendation?.(recommendation.item)}
                >
                  <img
                    src={recommendation.item.image}
                    alt={recommendation.item.name}
                    loading="lazy"
                  />
                  <span>
                    <strong>{recommendation.item.name}</strong>
                    <small>
                      {Math.round(recommendation.score * 100)}% match
                      {recommendation.reasons.length > 0
                        ? ` - ${recommendation.reasons.join(", ")}`
                        : ""}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="clothing-modal-actions">
            <button className="swap-request-btn" type="button" onClick={handleSwap}>
              Request Swap
            </button>
            <button className="modal-secondary-btn" type="button" onClick={onClose}>
              Keep Browsing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
