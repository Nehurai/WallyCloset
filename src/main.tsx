import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ClothingProvider } from "./context/ClothingContext";
import { SwapProvider } from "./context/SwapContext";
import { AuthProvider } from "./context/AuthContext";

// Lazy load your pages
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home"));
const ClosetGallery = lazy(() => import("./pages/ClosetGallery"));
const UploadClothing = lazy(() => import("./pages/UploadClothing"));
const Swap = lazy(() => import("./pages/Swap"));
const MySwaps = lazy(() => import("./pages/Myswaps"));
const Profile = lazy(() => import("./pages/Profile"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Coupons = lazy(() => import("./pages/Coupons"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ClothingProvider>
        <SwapProvider>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/closet" element={<ProtectedRoute><ClosetGallery /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><UploadClothing /></ProtectedRoute>} />
                <Route path="/swap" element={<ProtectedRoute><Swap /></ProtectedRoute>} />
                <Route path="/myswaps" element={<ProtectedRoute><MySwaps /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/coupons" element={<Coupons />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SwapProvider>
      </ClothingProvider>
    </AuthProvider>
  </React.StrictMode>
);
