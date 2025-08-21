import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Profile.css";
import EditProfileModal from "../components/EditProfileModal";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
// import React from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState({
    name: "Neha Rai",
    email: user?.email || "",
    bio: "Fashion-forward, sustainability lover 👗🌿",
    avatar: "https://i.pravatar.cc/100",
    address: "Patna, India",
    language: "English",
  });

  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setProfile(snapshot.data() as any);
        }
      }
    }
    fetchUserProfile();
  }, [user]);

  const handleUpdateProfile = async (updatedData: {
    name: string;
    email: string;
    bio: string;
  }) => {
    const updatedProfile = { ...profile, ...updatedData };
    setProfile(updatedProfile);
    setShowModal(false);

    if (user) {
      await setDoc(doc(db, "users", user.uid), updatedProfile);
    }

  };

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  };

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <img src={profile.avatar} alt="Profile" className="profile-avatar" />
        <div className="profile-details">
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          <p>Bio: {profile.bio}</p>
          <button className="edit-btn" onClick={() => setShowModal(true)}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-card">
          <h4>Coins</h4>
          <p>120</p>
        </div>
        <div className="stat-card">
          <h4>Closet Score</h4>
          <p>89</p>
        </div>
        <div className="stat-card">
          <h4>Coupons</h4>
          <p>5</p>
        </div>
        <div className="stat-card">
          <h4>Wishlist</h4>
          <p>14</p>
        </div>
      </div>

      {/* Menu */}
      <div className="profile-menu">
        <Link to="/my-swaps">My Swaps</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/coupons">Coupons</Link>
        <p>Address: {profile.address}</p>
        <p>Language: {profile.language}</p>
        <button onClick={handleLogout} className="logout">
          Log Out
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <Link to="/home">Home</Link>
        <Link to="/closet">Closet</Link>
        <Link to="/swap">Swap</Link>
        <Link to="/my-swaps">My Swaps</Link>
        <Link to="/profile" className="active">
          Profile
        </Link>
      </div>

      {/* Modal */}
      {showModal && (
        <EditProfileModal
          current={profile}
          onClose={() => setShowModal(false)}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
}
