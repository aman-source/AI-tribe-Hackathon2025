import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm your task assistant. Ask me about tasks, assignments, or project status. Try asking:\n• Who is working on [task name]?\n• Is [task name] complete?\n• Show me all tasks assigned to [person]\n• What tasks are in development?"
    }
  ]);
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("jira-tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Check for task completion
    if (lowerQuery.includes("complete") || lowerQuery.includes("finished") || lowerQuery.includes("done")) {
      const completedTasks = tasks.filter(t => t.status === "Complete");
      if (completedTasks.length === 0) {
        return "No tasks are marked as complete yet.";
      }
      return `✅ Completed tasks:\n${completedTasks.map(t => 
        `• ${t.story} (by ${t.assignee})`
      ).join("\n")}`;
    }

    // Check for task assignment
    if (lowerQuery.includes("assigned to") || lowerQuery.includes("working on")) {
      const personMatch = tasks.find(t => 
        lowerQuery.includes(t.assignee.toLowerCase())
      );
      if (personMatch) {
        const personTasks = tasks.filter(t => t.assignee === personMatch.assignee);
        return `📋 ${personMatch.assignee} is working on:\n${personTasks.map(t => 
          `• ${t.story} [${t.status}]`
        ).join("\n")}`;
      }
      return "I couldn't find that person in the system. Please check the name.";
    }

    // Check for specific task
    const matchedTask = tasks.find(t => 
      lowerQuery.includes(t.story.toLowerCase())
    );
    if (matchedTask) {
      return `📌 Task: ${matchedTask.story}\n` +
             `👤 Assigned to: ${matchedTask.assignee}\n` +
             `📊 Status: ${matchedTask.status}\n` +
             `🎯 Priority: ${matchedTask.priority}\n` +
             `📅 Start: ${matchedTask.startDate}\n` +
             `📅 End: ${matchedTask.endDate}`;
    }

    // Check for status-based queries
    if (lowerQuery.includes("in development") || lowerQuery.includes("development")) {
      const devTasks = tasks.filter(t => t.status === "In Development");
      if (devTasks.length === 0) {
        return "No tasks are currently in development.";
      }
      return `🔨 Tasks in development:\n${devTasks.map(t => 
        `• ${t.story} (${t.assignee})`
      ).join("\n")}`;
    }

    if (lowerQuery.includes("testing") || lowerQuery.includes("test")) {
      const testTasks = tasks.filter(t => 
        t.status === "In Functional Test" || t.status === "E2E"
      );
      if (testTasks.length === 0) {
        return "No tasks are currently in testing.";
      }
      return `🧪 Tasks in testing:\n${testTasks.map(t => 
        `• ${t.story} [${t.status}] (${t.assignee})`
      ).join("\n")}`;
    }

    if (lowerQuery.includes("deploy") || lowerQuery.includes("waiting")) {
      const deployTasks = tasks.filter(t => t.status === "Waiting to Deploy");
      if (deployTasks.length === 0) {
        return "No tasks are waiting to deploy.";
      }
      return `🚀 Tasks waiting to deploy:\n${deployTasks.map(t => 
        `• ${t.story} (${t.assignee})`
      ).join("\n")}`;
    }

    // Show all tasks
    if (lowerQuery.includes("all tasks") || lowerQuery.includes("show all")) {
      if (tasks.length === 0) {
        return "No tasks found in the system.";
      }
      return `📊 All tasks (${tasks.length} total):\n${tasks.map(t => 
        `• ${t.story} - ${t.status} (${t.assignee})`
      ).join("\n")}`;
    }

    // Statistics
    if (lowerQuery.includes("how many") || lowerQuery.includes("count")) {
      return `📊 Task Statistics:\n` +
             `• Total tasks: ${tasks.length}\n` +
             `• Completed: ${tasks.filter(t => t.status === "Complete").length}\n` +
             `• In Development: ${tasks.filter(t => t.status === "In Development").length}\n` +
             `• In Testing: ${tasks.filter(t => t.status.includes("Test") || t.status === "E2E").length}\n` +
             `• Waiting to Deploy: ${tasks.filter(t => t.status === "Waiting to Deploy").length}`;
    }

    // Default response
    return "I'm not sure about that. Try asking:\n" +
           "• 'Who is working on [task name]?'\n" +
           "• 'Is [task name] complete?'\n" +
           "• 'Show me all tasks'\n" +
           "• 'How many tasks are complete?'\n" +
           "• 'What tasks are in development?'";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const response = processQuery(input);
      const botMessage = { type: "bot", text: response };
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>🤖 Task Assistant</h1>
        <p>Ask me anything about your tasks and projects</p>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <div className="message-avatar">
              {msg.type === "bot" ? "🤖" : "👤"}
            </div>
            <div className="message-content">
              {msg.text.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-container">
        <input
          type="text"
          className="chatbot-input"
          placeholder="Ask about tasks, assignments, or status..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="chatbot-send-btn" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;