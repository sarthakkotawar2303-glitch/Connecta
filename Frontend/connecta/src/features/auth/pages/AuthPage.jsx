import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import useAuth from "../hooks/useAuth";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const AuthPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (user) navigate("/home", { replace: true });
  }, [user, navigate]);

  const {
    loading, error, preview,
    handleChange, handleLogin, handleSignup, clearError,
  } = useAuth();

  const handleTabSwitch = (loginTab) => {
    setIsLogin(loginTab);
    clearError();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#071324] px-4 relative overflow-hidden font-sans selection:bg-[#2B6CB0] selection:text-white">
      {/* Geometric Blueprint SVG Grid Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="architectural-grid" width="160" height="160" patternUnits="userSpaceOnUse">
              {/* Outer grid boundary */}
              <rect width="160" height="160" fill="none" stroke="#3B82F6" strokeWidth="0.75" />
              {/* Diagonals forming crossing diamonds */}
              <path d="M 0 0 L 160 160 M 160 0 L 0 160" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
              {/* Center crosshair grid lines */}
              <path d="M 80 0 L 80 160 M 0 80 L 160 80" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
              {/* Nested diamond outline */}
              <path d="M 80 0 L 160 80 L 80 160 L 0 80 Z" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
              {/* Muted grid subdivisions for technical drafting look */}
              <path d="M 40 0 L 40 160 M 120 0 L 120 160 M 0 40 L 160 40 M 0 120 L 160 120" fill="none" stroke="#3B82F6" strokeWidth="0.25" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#architectural-grid)" />
        </svg>
        {/* Soft centered ambient blue lighting overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(43,108,176,0.15)_0%,transparent_75%)] pointer-events-none" />
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-[430px] bg-white p-8 md:p-10 shadow-[0_10px_45_rgba(0,0,0,0.35)] border border-[#E2E8F0] rounded-[6px] z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#007AFF] flex items-center justify-center mb-4 rounded-none shadow-sm">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              {/* Spokes */}
              <line x1="50" y1="50" x2="50" y2="20" stroke="white" strokeWidth="7" />
              <line x1="50" y1="50" x2="78.5" y2="40.7" stroke="white" strokeWidth="7" />
              <line x1="50" y1="50" x2="67.6" y2="74.3" stroke="white" strokeWidth="7" />
              <line x1="50" y1="50" x2="32.4" y2="74.3" stroke="white" strokeWidth="7" />
              <line x1="50" y1="50" x2="21.5" y2="40.7" stroke="white" strokeWidth="7" />

              {/* Center Circle */}
              <circle cx="50" cy="50" r="13" fill="#007AFF" stroke="white" strokeWidth="7" />

              {/* Outer Circles */}
              <circle cx="50" cy="20" r="8" fill="#007AFF" stroke="white" strokeWidth="7" />
              <circle cx="78.5" cy="40.7" r="8" fill="#007AFF" stroke="white" strokeWidth="7" />
              <circle cx="67.6" cy="74.3" r="8" fill="#007AFF" stroke="white" strokeWidth="7" />
              <circle cx="32.4" cy="74.3" r="8" fill="#007AFF" stroke="white" strokeWidth="7" />
              <circle cx="21.5" cy="40.7" r="8" fill="#007AFF" stroke="white" strokeWidth="7" />
            </svg>
          </div>
          <h2 className="text-[34px] font-bold text-[#0B192C] tracking-tight mb-1 font-sans text-center">Connecta</h2>
          <p className="text-sm text-slate-500 font-sans text-center">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        {/* Form Render */}
        <div className="transition duration-300">
          {isLogin ? (
            <LoginForm
              onSubmit={handleLogin}
              loading={loading}
              error={error}
              handleChange={handleChange}
              handleTabSwitch={handleTabSwitch}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignup}
              loading={loading}
              error={error}
              preview={preview}
              handleChange={handleChange}
              handleTabSwitch={handleTabSwitch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
