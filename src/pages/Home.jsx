import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-blue-600">DevMetrics</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          A unified productivity dashboard for your engineering teams.  
          Monitor tasks, identify bottlenecks, and visualize project progress in real time.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
          >
            View Dashboard
          </Link>
          <Link
            to="/chatbot"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition"
          >
            Open Chatbot
          </Link>
        </div>
      </div>
    </div>
  );
}
