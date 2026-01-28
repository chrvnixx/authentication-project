import { Route, Routes } from "react-router";
import "./App.css";
import FloatingShape from "./components/FloatingShape";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/loginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import Dashboard from "./pages/Dashboard";
// 123456
function App() {
  return (
    <>
      <div
        className="min-h-screen bg-linear-to-br
  from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
      >
        <FloatingShape
          color="bg-green-500"
          size="w-64 h-64"
          top="5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-green-500"
          size="w-48 h-48"
          top="5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-green-500"
          size="w-32 h-32"
          top="5%"
          left="10%"
          delay={0}
        />
        <Routes>
          <Route path="/" element={"Home"} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
