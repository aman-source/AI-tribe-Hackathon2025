import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Home.css";
import "./Board.css";
const boardTeams = {
  "mav-cds": {
    name: "Mav-CDS",
    members: ["Manoj Naidu", "Sravani", "Kiran"]
  },
  "mavcvs": {
    name: "MAVCVS",
    members: ["Ravi", "Priya", "Suresh"]
  }
};

const statusOptions = [
  "Defining Details",
  "In Development",
  "In Functional Test",
  "E2E",
  "Waiting to Deploy",
  "Complete"
];

const Board = () => {
  const { boardId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const currentBoard = boardTeams[boardId];
  const teamMembers = currentBoard?.members || [];

  useEffect(() => {
    const savedTasks = localStorage.getItem("jira-tasks");
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      const boardTasks = allTasks.filter(task => 
        teamMembers.includes(task.assignee)
      );
      setTasks(boardTasks);
    }
  }, [boardId]);

  const saveTasks = (updatedTasks) => {
    const savedTasks = localStorage.getItem("jira-tasks");
    const allTasks = savedTasks ? JSON.parse(savedTasks) : [];
    
    // Update or add tasks
    const otherBoardTasks = allTasks.filter(task => 
      !teamMembers.includes(task.assignee)
    );
    const newAllTasks = [...otherBoardTasks, ...updatedTasks];
    
    localStorage.setItem("jira-tasks", JSON.stringify(newAllTasks));
    setTasks(updatedTasks);
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task
    );
    saveTasks(updated);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTask = {
      id: Date.now(),
      name: formData.get("name"),
      story: formData.get("story"),
      status: "Defining Details",
      assignee: formData.get("assignee"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      priority: formData.get("priority"),
      board: boardId
    };
    saveTasks([...tasks, newTask]);
    setIsCreating(false);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = tasks.map((task) =>
      task.id === selectedTask.id
        ? {
            ...task,
            name: formData.get("name"),
            story: formData.get("story"),
            assignee: formData.get("assignee"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            priority: formData.get("priority"),
            status: formData.get("status")
          }
        : task
    );
    saveTasks(updated);
    setSelectedTask(null);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      saveTasks(tasks.filter((task) => task.id !== id));
      setSelectedTask(null);
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  const getStatusColor = (status) => {
    const colors = {
      "Defining Details": "#6b7280",
      "In Development": "#3b82f6",
      "In Functional Test": "#eab308",
      "E2E": "#f97316",
      "Waiting to Deploy": "#a855f7",
      "Complete": "#22c55e"
    };
    return colors[status] || "#6b7280";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: "#ef4444",
      Medium: "#f59e0b",
      Low: "#22c55e"
    };
    return colors[priority] || "#6b7280";
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "All" || task.status === filterStatus;
    const matchesSearch =
      task.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!currentBoard) {
    return (
      <div className="home-container">
        <div className="board-not-found">
          <h2>Board not found</h2>
          <p>Please select a valid board from the navigation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="home-header">
        <h1 className="company-name">{currentBoard.name} Board</h1>
        <p className="tagline">
          Team: {teamMembers.join(", ")} ⚡
        </p>
      </header>

      {/* Toolbar */}
      <div className="jira-toolbar">
        <div className="toolbar-left">
          <input
            type="text"
            placeholder="Search tasks..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button className="create-btn" onClick={() => setIsCreating(true)}>
          + Create Task
        </button>
      </div>

      {/* Task Board Section */}
      <section className="board-section">
        <div className="board-grid">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. Create a new task to get started!</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`board-card ${getStatusClass(task.status)}`}
                onClick={() => setSelectedTask(task)}
              >
                <div className="card-header">
                  <div className="card-title-row">
                    <h3>{task.story}</h3>
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="assignee-row">
                    <div className="avatar" title={task.assignee}>
                      {getInitials(task.assignee)}
                    </div>
                    <span className="assignee-name">{task.assignee}</span>
                  </div>

                  <div className="date-row">
                    <div className="date-item">
                      <span className="date-label">Start:</span>
                      <span className="date-value">{task.startDate}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">End:</span>
                      <span className="date-value">{task.endDate}</span>
                    </div>
                  </div>

                  <div className="status-row">
                    <select
                      value={task.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(task.id, e.target.value);
                      }}
                      className="status-select"
                      style={{ borderLeftColor: getStatusColor(task.status) }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Create Task Modal */}
      {isCreating && (
        <div className="modal-overlay" onClick={() => setIsCreating(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button
                className="close-btn"
                onClick={() => setIsCreating(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Name</label>
                <input type="text" name="story" required />
              </div>
              <div className="form-group">
                <label>Assignee (Team Member)</label>
                <select name="assignee" required>
                  {teamMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Person Name</label>
                <input type="text" name="name" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" name="startDate" required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" name="endDate" required />
                </div>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" required>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedTask(null)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateTask}>
              <div className="form-group">
                <label>Task Name</label>
                <input
                  type="text"
                  name="story"
                  defaultValue={selectedTask.story}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assignee (Team Member)</label>
                <select name="assignee" defaultValue={selectedTask.assignee} required>
                  {teamMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Person Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedTask.name}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={selectedTask.startDate}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={selectedTask.endDate}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" defaultValue={selectedTask.status} required>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" defaultValue={selectedTask.priority} required>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDeleteTask(selectedTask.id)}
                >
                  Delete
                </button>
                <div className="modal-actions-right">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setSelectedTask(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Update Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;