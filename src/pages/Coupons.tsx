import { useState } from "react";
import "../styles/Coupons.css";

export default function Coupons() {
  const [user, setUser] = useState({
    avatar: "https://i.pravatar.cc/150",
    name: "Neha Rai",
    email: "neha@example.com",
    bio: "Fashion-forward, sustainability lover 👗🌿",
    address: "",
    language: "English",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setUser((prev) => ({ ...prev, avatar: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // const handleUpdateProfile = (updatedData: {
  //   name: string;
  //   email: string;
  //   bio: string;
  // }) => {
  //   setUser((prev) => ({ ...prev, ...updatedData }));
  // };

  return (
    <div className="coupons-page">
      <h2>Coupons</h2>
      <p>You have 5 active coupons</p>

      <div className="profile-preview">
        <img src={user.avatar} alt="Avatar" className="profile-avatar" />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
        <p><strong>{user.name}</strong></p>
        <p>{user.email}</p>
        <p>{user.bio}</p>
      </div>
    </div>
  );
}
