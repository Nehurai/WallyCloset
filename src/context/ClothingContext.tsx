import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

// TypeScript interfaces
export interface ClothingItem {
  id: number;
  name: string;
  image: string;
  category: string;
  date: string;
  color?: string;
  tags?: string[];
  size?: string;
  condition?: string;
  notes?: string;
}

interface ClothingContextType {
  clothes: ClothingItem[];
  addClothing: (item: ClothingItem) => Promise<void>;
}

// Create the context
const ClothingContext = createContext<ClothingContextType>({} as ClothingContextType);

// Hook to use context
// eslint-disable-next-line react-refresh/only-export-components
export const useClothing = () => useContext(ClothingContext);

// Provider
export function ClothingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [clothes, setClothes] = useState<ClothingItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const docRef = doc(db, "closets", user.uid);
    const unsub = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setClothes(data.items || []);
        } else {
          setClothes([]);
        }
      },
      (error) => {
        console.error("Could not load closet items", error);
        setClothes([]);
      }
    );

    return () => unsub();
  }, [user]);

  const addClothing = async (item: ClothingItem) => {
    if (!user) {
      throw new Error("You must be logged in to upload clothing.");
    }

    const docRef = doc(db, "closets", user.uid);
    const docSnap = await getDoc(docRef);
    const existing = docSnap.exists() ? docSnap.data().items : [];

    const updated = [...existing, item];
    await setDoc(docRef, { items: updated });
  };

  return (
    <ClothingContext.Provider value={{ clothes, addClothing }}>
      {children}
    </ClothingContext.Provider>
  );
}
