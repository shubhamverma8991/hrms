import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/login/login";
import Dashboard from "./components/dashboard";
import Leave from "./components/leave/leave";
import Employee from "./components/employee/employee";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/employee" element={<Employee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
