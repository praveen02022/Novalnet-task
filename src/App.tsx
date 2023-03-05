import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import Dashoard from "./dashboard";
import Login from "./login";
import Signup from "./signup";
import EmailVerify from "./verifyemail";
import PrivateRoute from "./privateRoute";
import ResetPassword from "./ResetPassword";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route
          path="/api/password-reset/:id/:token"
          element={<ResetPassword />}
        />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashoard />} />
          <Route path="/" element={<Dashoard />} />
          <Route path="/api/user/verify/:id/:token" element={<EmailVerify />} />
          <Route
            path="/api/password-reset/:id/:token"
            element={<ResetPassword />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
