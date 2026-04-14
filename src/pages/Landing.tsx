import { Link } from "react-router-dom";
import "../styles/Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-box">
        <img
          src="https://cdn-icons-png.flaticon.com/512/9028/9028444.png"
          alt="WallyCloset Logo"
          className="landing-logo"
        />
        <h1 className="landing-title">WallyCloset</h1>
        <p className="landing-subtitle">Start Your Sustainable Fashion Journey 👗🌍</p>
        <Link to="/home" className="landing-btn">
          Start Swapping
        </Link>
        <Link to="/signup" className="landing-btn secondary">Sign Up</Link>
        <Link to="/login" className="landing-btn secondary">Log In</Link>

      </div>
    </div>
  );
}
