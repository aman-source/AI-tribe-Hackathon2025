import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import Chatbot from "./pages/Chatbot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
