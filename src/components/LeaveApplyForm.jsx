// LeaveApplyForm.jsx
import { useState } from "react";

export default function LeaveApplyForm() {
  const [form, setForm] = useState({ from: "", to: "", type: "Casual", reason: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await axios.post("/api/leave/apply", form);
      alert("Leave Applied Successfully");
    } catch (err) {
      alert("Error applying for leave");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-xl font-bold mb-2">Apply for Leave</h2>
      <label>From Date:</label>
      <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required />
      <label>To Date:</label>
      <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required />
      <label>Leave Type:</label>
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
        <option>Casual</option>
        <option>Sick</option>
        <option>Earned</option>
      </select>
      <label>Reason:</label>
      <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
      <button type="submit" className="btn btn-primary mt-2">Submit</button>
    </form>
  );
}
