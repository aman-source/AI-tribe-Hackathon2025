import { Link, NavLink } from "react-router-dom";
import "./Navbar.css"; // Import the CSS

export default function Navbar() {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Chatbot", path: "/chatbot" },
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        DevMetrics
      </Link>

      {/* Navigation Links */}
      <div className="navbar-links">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Hamburger (for mobile) */}
      <div className="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}
