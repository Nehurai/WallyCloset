import { createContext, useContext, useState} from "react";
import type { ReactNode } from "react";

export interface SwapItem {
  id: number;
  itemName: string;
  image: string;
  status: "pending" | "accepted" | "declined";
}

interface SwapContextType {
  swapItems: SwapItem[];
  requestSwap: (item: SwapItem) => void;
  acceptSwap: (id: number) => void;
  declineSwap: (id: number) => void;
}

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export function SwapProvider({ children }: { children: ReactNode }) {
  const [swapItems, setSwapItems] = useState<SwapItem[]>([]);

  const requestSwap = (item: SwapItem) => {
    setSwapItems((prev) => [...prev, item]);
  };

  const acceptSwap = (id: number) => {
    setSwapItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "accepted" } : item
      )
    );
  };

  const declineSwap = (id: number) => {
    setSwapItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "declined" } : item
      )
    );
  };

  return (
    <SwapContext.Provider
      value={{ swapItems, requestSwap, acceptSwap, declineSwap }}
    >
      {children}
    </SwapContext.Provider>
  );
}

export function useSwap() {
  const context = useContext(SwapContext);
  if (!context) {
    throw new Error("useSwap must be used within a SwapProvider");
  }
  return context;
}
