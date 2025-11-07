import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    byStatus: {},
    byPriority: {},
    byAssignee: {}
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem("jira-tasks");
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      setTasks(allTasks);
      calculateStats(allTasks);
    }
  }, []);

  const calculateStats = (taskList) => {
    const byStatus = {};
    const byPriority = {};
    const byAssignee = {};

    taskList.forEach(task => {
      // Count by status
      byStatus[task.status] = (byStatus[task.status] || 0) + 1;

      // Count by priority
      byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;

      // Count by assignee
      byAssignee[task.assignee] = (byAssignee[task.assignee] || 0) + 1;
    });

    setStats({
      total: taskList.length,
      completed: byStatus["Complete"] || 0,
      inProgress: byStatus["In Development"] || 0,
      byStatus,
      byPriority,
      byAssignee
    });
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

  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Project Dashboard</h1>
        <p>Real-time analytics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: "#3b82f6" }}>
            📝
          </div>
          <div className="metric-content">
            <h3>Total Tasks</h3>
            <p className="metric-value">{stats.total}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: "#22c55e" }}>
            ✅
          </div>
          <div className="metric-content">
            <h3>Completed</h3>
            <p className="metric-value">{stats.completed}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: "#f59e0b" }}>
            🔨
          </div>
          <div className="metric-content">
            <h3>In Progress</h3>
            <p className="metric-value">{stats.inProgress}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: "#8b5cf6" }}>
            📈
          </div>
          <div className="metric-content">
            <h3>Completion Rate</h3>
            <p className="metric-value">{completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Status Distribution */}
        <div className="chart-card">
          <h2>Tasks by Status</h2>
          <div className="bar-chart">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="bar-item">
                <div className="bar-label">{status}</div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(count / stats.total) * 100}%`,
                      background: getStatusColor(status)
                    }}
                  >
                    <span className="bar-value">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="chart-card">
          <h2>Tasks by Priority</h2>
          <div className="donut-chart">
            {Object.entries(stats.byPriority).map(([priority, count]) => (
              <div key={priority} className="donut-item">
                <div
                  className="donut-circle"
                  style={{ background: getPriorityColor(priority) }}
                >
                  {count}
                </div>
                <div className="donut-label">
                  <strong>{priority}</strong>
                  <span>{Math.round((count / stats.total) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="team-section">
        <h2>Team Performance</h2>
        <div className="team-grid">
          {Object.entries(stats.byAssignee).map(([assignee, count]) => {
            const assigneeTasks = tasks.filter(t => t.assignee === assignee);
            const completed = assigneeTasks.filter(t => t.status === "Complete").length;
            const completionPercent = Math.round((completed / count) * 100);

            return (
              <div key={assignee} className="team-card">
                <div className="team-avatar">
                  {assignee.split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
                <h3>{assignee}</h3>
                <div className="team-stats">
                  <div className="team-stat">
                    <span className="stat-label">Total Tasks</span>
                    <span className="stat-value">{count}</span>
                  </div>
                  <div className="team-stat">
                    <span className="stat-label">Completed</span>
                    <span className="stat-value">{completed}</span>
                  </div>
                  <div className="team-stat">
                    <span className="stat-label">Success Rate</span>
                    <span className="stat-value">{completionPercent}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${completionPercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>Recent Tasks</h2>
        <div className="activity-list">
          {tasks.slice(0, 5).map(task => (
            <div key={task.id} className="activity-item">
              <div
                className="activity-status"
                style={{ background: getStatusColor(task.status) }}
              ></div>
              <div className="activity-content">
                <h4>{task.story}</h4>
                <p>
                  <strong>{task.assignee}</strong> • {task.status} • {task.priority} Priority
                </p>
              </div>
              <div className="activity-date">
                {task.endDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;