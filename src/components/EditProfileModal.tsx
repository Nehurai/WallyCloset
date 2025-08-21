import { useState } from "react";
import "../styles/EditProfileModal.css";

interface Props {
  onClose: () => void;
  current: {
    name: string;
    email: string;
    bio: string;
  };
  onSave: (data: { name: string; email: string; bio: string }) => void;
}

export default function EditProfileModal({ onClose, current, onSave }: Props) {
  const [form, setForm] = useState(current);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Profile</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" />
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
