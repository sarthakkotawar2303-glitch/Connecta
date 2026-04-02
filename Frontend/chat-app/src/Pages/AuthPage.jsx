import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../Context/ChatProvider";
import useAuth from "../Components/Auth/useAuth";
import LoginForm from "../Components/Auth/LoginForm";
import SignupForm from "../Components/Auth/SignupForm";

const AuthPage = () => {
  const { user } = useChat();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (user) navigate("/home", { replace: true });
  }, [user]);

  const {
    loading, error, preview,
    handleChange, handleLogin, handleSignup, clearError,
  } = useAuth();

  const handleTabSwitch = (loginTab) => {
    setIsLogin(loginTab);
    clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-10" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767A4 4 0 0015 13h2a2 2 0 002-2V9a2 2 0 00-2-2h-2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight"> <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767A4 4 0 0015 13h2a2 2 0 002-2V9a2 2 0 00-2-2h-2z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Connecta</span>
        </div></span>
          </div>
          <p className="text-slate-400 text-sm">
            {isLogin ? "Welcome back! Sign in to continue." : "Create your account to get started."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          {/* Tab switcher */}
          <div className="flex bg-slate-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => handleTabSwitch(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isLogin ? "bg-white text-slate-900 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleTabSwitch(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isLogin ? "bg-white text-slate-900 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {isLogin ? (
            <LoginForm
              onSubmit={handleLogin}
              loading={loading}
              error={error}
              handleChange={handleChange}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignup}
              loading={loading}
              error={error}
              preview={preview}
              handleChange={handleChange}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthPage

//all fine