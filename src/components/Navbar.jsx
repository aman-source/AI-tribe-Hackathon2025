import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [showBoardsMenu, setShowBoardsMenu] = useState(false);
  const navigate = useNavigate();

  const boards = [
    { id: "mav-cds", name: "Mav-CDS" },
    { id: "mavcvs", name: "MAVCVS" }
  ];

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Defects", path: "/defects" },
    { name: "Chatbot", path: "/chatbot" },
  ];

  const handleBoardSelect = (boardId) => {
    navigate(`/board/${boardId}`);
    setShowBoardsMenu(false);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        DevMetrics
      </Link>

      {/* Navigation Links */}
      <div className="navbar-links">
        {/* Boards Dropdown */}
        <div className="boards-dropdown">
          <button
            className="boards-trigger"
            onClick={() => setShowBoardsMenu(!showBoardsMenu)}
          >
            Boards ▾
          </button>
          {showBoardsMenu && (
            <div className="boards-menu">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className="board-item"
                  onClick={() => handleBoardSelect(board.id)}
                >
                  {board.name}
                </div>
              ))}
            </div>
          )}
        </div>

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