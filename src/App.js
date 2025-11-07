import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Defects from "./pages/Defects";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board/:boardId" element={<Board />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/defects" element={<Defects />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;