import { useState, useRef } from "react";
import "./App.css";

const FILTERS = ["All", "Active", "Completed"];

const quotes = [
  "Small steps every day.",
  "Done is better than perfect.",
  "Focus on progress, not perfection.",
  "You've got this. One task at a time.",
];

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Buy groceries 🛒", done: false },
    { id: 2, text: "Read for 20 minutes 📚", done: true },
    { id: 3, text: "Go for a walk 🌿", done: false },
  ]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef();

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTasks([...tasks, { id: Date.now(), text: trimmed, done: false }]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const clearCompleted = () => setTasks(tasks.filter((t) => !t.done));

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t)));
    setEditingId(null);
  };

  const filtered = tasks.filter((t) => {
    if (filter === "Active") return !t.done;
    if (filter === "Completed") return t.done;
    return true;
  });

  const remaining = tasks.filter((t) => !t.done).length;
  const donePct = tasks.length ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0;

  return (
    <div className="app-shell">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="card">
        <div className="header">
          <div className="title">My <span>To‑Dos</span></div>
          <div className="quote">"{quote}"</div>
        </div>

        {tasks.length > 0 && (
          <div className="progress-wrap">
            <div className="progress-label">
              <span>Progress</span>
              <span>{donePct}% complete</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${donePct}%` }} />
            </div>
          </div>
        )}

        <div className="input-row">
          <input
            ref={inputRef}
            className="task-input"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button className="add-btn" onClick={addTask}>＋</button>
        </div>

        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="task-list">
          {filtered.length === 0 && (
            <div className="empty">
              {filter === "Completed" ? "No completed tasks yet 🎯" :
               filter === "Active" ? "All done! 🎉" : "Add your first task above ✨"}
            </div>
          )}
          {filtered.map((task) => (
            <div className="task-item" key={task.id}>
              <div
                className={`checkbox ${task.done ? "checked" : ""}`}
                onClick={() => toggleTask(task.id)}
              >
                {task.done && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              {editingId === task.id ? (
                <input
                  className="edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(task.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <span className={`task-text ${task.done ? "done" : ""}`}>{task.text}</span>
              )}

              {editingId === task.id ? (
                <button className="icon-btn save" onClick={() => saveEdit(task.id)}>✓</button>
              ) : (
                <button className="icon-btn" onClick={() => startEdit(task)}>✎</button>
              )}
              <button className="icon-btn delete" onClick={() => deleteTask(task.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="footer">
          <div className="count">
            <strong>{remaining}</strong> task{remaining !== 1 ? "s" : ""} left
          </div>
          {tasks.some((t) => t.done) && (
            <button className="clear-btn" onClick={clearCompleted}>Clear completed</button>
          )}
        </div>
      </div>
    </div>
  );
}
