import { useState } from "react";
import axios from "axios";

export default function AttendancePage() {
  const [status, setStatus] = useState("Not Checked In");
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await axios.post("/api/attendance/check-in", { date: new Date() });
      setStatus("Checked In");
    } catch (err) {
      alert("Error during check-in");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await axios.post("/api/attendance/check-out", { date: new Date() });
      setStatus("Checked Out");
    } catch (err) {
      alert("Error during check-out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Attendance</h2>
      <p>Status: {status}</p>
      <button onClick={handleCheckIn} disabled={loading || status !== "Not Checked In"} className="btn btn-primary m-2">
        Check In
      </button>
      <button onClick={handleCheckOut} disabled={loading || status !== "Checked In"} className="btn btn-secondary">
        Check Out
      </button>
    </div>
  );
}






