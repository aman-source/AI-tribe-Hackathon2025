import React, { useState, useEffect } from "react";
import "./Defects.css";

const Defects = () => {
  const [defects, setDefects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDefect, setEditingDefect] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    severity: "Medium",
    priority: "Medium",
    status: "Open",
    assignee: "",
    reportedBy: "",
    reportedDate: "",
    resolvedDate: "",
    environment: "Development",
    module: ""
  });

  const severityOptions = ["Critical", "High", "Medium", "Low"];
  const priorityOptions = ["Critical", "High", "Medium", "Low"];
  const statusOptions = ["Open", "In Progress", "Fixed", "Verified", "Closed", "Reopened"];
  const environmentOptions = ["Development", "Testing", "Staging", "Production"];

  useEffect(() => {
    const savedDefects = localStorage.getItem("defect-list");
    if (savedDefects) {
      setDefects(JSON.parse(savedDefects));
    }
  }, []);

  const saveToLocalStorage = (defectList) => {
    localStorage.setItem("defect-list", JSON.stringify(defectList));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingDefect) {
      const updatedDefects = defects.map((defect) =>
        defect.id === editingDefect.id ? { ...formData, id: editingDefect.id } : defect
      );
      setDefects(updatedDefects);
      saveToLocalStorage(updatedDefects);
    } else {
      const newDefect = {
        ...formData,
        id: `DEF-${Date.now()}`
      };
      const updatedDefects = [...defects, newDefect];
      setDefects(updatedDefects);
      saveToLocalStorage(updatedDefects);
    }

    resetForm();
  };

  const handleEdit = (defect) => {
    setEditingDefect(defect);
    setFormData(defect);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this defect?")) {
      const updatedDefects = defects.filter((defect) => defect.id !== id);
      setDefects(updatedDefects);
      saveToLocalStorage(updatedDefects);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      severity: "Medium",
      priority: "Medium",
      status: "Open",
      assignee: "",
      reportedBy: "",
      reportedDate: "",
      resolvedDate: "",
      environment: "Development",
      module: ""
    });
    setEditingDefect(null);
    setShowModal(false);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Critical: "#dc2626",
      High: "#ea580c",
      Medium: "#f59e0b",
      Low: "#84cc16"
    };
    return colors[severity] || "#6b7280";
  };

  const getStatusColor = (status) => {
    const colors = {
      Open: "#ef4444",
      "In Progress": "#3b82f6",
      Fixed: "#8b5cf6",
      Verified: "#10b981",
      Closed: "#22c55e",
      Reopened: "#f97316"
    };
    return colors[status] || "#6b7280";
  };

  const getStats = () => {
    const stats = {
      total: defects.length,
      open: defects.filter(d => d.status === "Open").length,
      inProgress: defects.filter(d => d.status === "In Progress").length,
      fixed: defects.filter(d => d.status === "Fixed").length,
      closed: defects.filter(d => d.status === "Closed").length,
      critical: defects.filter(d => d.severity === "Critical").length,
      high: defects.filter(d => d.severity === "High").length
    };
    return stats;
  };

  const stats = getStats();

  return (
    <div className="defects-container">
      <div className="defects-header">
        <div className="header-content">
          <h1>🐛 Defects Management</h1>
          <p>Track and manage project defects</p>
        </div>
        <button className="btn-add-defect" onClick={() => setShowModal(true)}>
          ➕ Add New Defect
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-label">Total Defects</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card stat-open">
          <div className="stat-icon">🔴</div>
          <div className="stat-info">
            <span className="stat-label">Open</span>
            <span className="stat-value">{stats.open}</span>
          </div>
        </div>
        <div className="stat-card stat-progress">
          <div className="stat-icon">🔵</div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats.inProgress}</span>
          </div>
        </div>
        <div className="stat-card stat-fixed">
          <div className="stat-icon">🟣</div>
          <div className="stat-info">
            <span className="stat-label">Fixed</span>
            <span className="stat-value">{stats.fixed}</span>
          </div>
        </div>
        <div className="stat-card stat-closed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-label">Closed</span>
            <span className="stat-value">{stats.closed}</span>
          </div>
        </div>
        <div className="stat-card stat-critical">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <span className="stat-label">Critical/High</span>
            <span className="stat-value">{stats.critical + stats.high}</span>
          </div>
        </div>
      </div>

      {/* Defects Table */}
      <div className="defects-table-container">
        <table className="defects-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Severity</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assignee</th>
              <th>Environment</th>
              <th>Reported Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {defects.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No defects found. Click "Add New Defect" to create one.
                </td>
              </tr>
            ) : (
              defects.map((defect) => (
                <tr key={defect.id}>
                  <td className="defect-id">{defect.id}</td>
                  <td className="defect-title">{defect.title}</td>
                  <td>
                    <span
                      className="badge badge-severity"
                      style={{ background: getSeverityColor(defect.severity) }}
                    >
                      {defect.severity}
                    </span>
                  </td>
                  <td>
                    <span
                      className="badge badge-priority"
                      style={{ background: getSeverityColor(defect.priority) }}
                    >
                      {defect.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className="badge badge-status"
                      style={{ background: getStatusColor(defect.status) }}
                    >
                      {defect.status}
                    </span>
                  </td>
                  <td>{defect.assignee || "Unassigned"}</td>
                  <td>{defect.environment}</td>
                  <td>{defect.reportedDate}</td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(defect)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(defect.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDefect ? "Edit Defect" : "Add New Defect"}</h2>
              <button className="btn-close" onClick={resetForm}>
                ✖
              </button>
            </div>
            <form onSubmit={handleSubmit} className="defect-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter defect title"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe the defect"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Severity *</label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    required
                  >
                    {severityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                  >
                    {priorityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Environment *</label>
                  <select
                    name="environment"
                    value={formData.environment}
                    onChange={handleInputChange}
                    required
                  >
                    {environmentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assignee</label>
                  <input
                    type="text"
                    name="assignee"
                    value={formData.assignee}
                    onChange={handleInputChange}
                    placeholder="Assigned to"
                  />
                </div>
                <div className="form-group">
                  <label>Module</label>
                  <input
                    type="text"
                    name="module"
                    value={formData.module}
                    onChange={handleInputChange}
                    placeholder="Module name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Reported By</label>
                  <input
                    type="text"
                    name="reportedBy"
                    value={formData.reportedBy}
                    onChange={handleInputChange}
                    placeholder="Reporter name"
                  />
                </div>
                <div className="form-group">
                  <label>Reported Date *</label>
                  <input
                    type="date"
                    name="reportedDate"
                    value={formData.reportedDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Resolved Date</label>
                  <input
                    type="date"
                    name="resolvedDate"
                    value={formData.resolvedDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingDefect ? "Update Defect" : "Add Defect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Defects;