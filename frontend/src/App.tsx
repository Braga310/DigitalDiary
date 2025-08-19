import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Planner";
import DoctorLedger from "./components/DoctorLedger";
import Expenses from "./components/Expenses";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/planner" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/doctorLedger" element={<DoctorLedger />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
