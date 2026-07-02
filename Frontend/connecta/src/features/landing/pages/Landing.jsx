import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";

const Landing = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#071324] px-4 relative overflow-hidden font-sans selection:bg-[#2B6CB0] selection:text-white">
      {/* Background Gradients and Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#007AFF] opacity-20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3B82F6] opacity-[0.08] rounded-full blur-[150px]"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#6366F1] opacity-20 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Content Card (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-4xl p-10 md:p-16 flex flex-col items-center text-center rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="w-20 h-20 bg-gradient-to-br from-[#007AFF] to-[#3B82F6] rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,122,255,0.4)]">
          <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-md">
            {/* Spokes */}
            <line x1="50" y1="50" x2="50" y2="20" stroke="white" strokeWidth="7" strokeLinecap="round" />
            <line x1="50" y1="50" x2="78.5" y2="40.7" stroke="white" strokeWidth="7" strokeLinecap="round" />
            <line x1="50" y1="50" x2="67.6" y2="74.3" stroke="white" strokeWidth="7" strokeLinecap="round" />
            <line x1="50" y1="50" x2="32.4" y2="74.3" stroke="white" strokeWidth="7" strokeLinecap="round" />
            <line x1="50" y1="50" x2="21.5" y2="40.7" stroke="white" strokeWidth="7" strokeLinecap="round" />
            {/* Center Circle */}
            <circle cx="50" cy="50" r="13" fill="#007AFF" stroke="white" strokeWidth="6" />
            {/* Outer Circles */}
            <circle cx="50" cy="20" r="8" fill="white" />
            <circle cx="78.5" cy="40.7" r="8" fill="white" />
            <circle cx="67.6" cy="74.3" r="8" fill="white" />
            <circle cx="32.4" cy="74.3" r="8" fill="white" />
            <circle cx="21.5" cy="40.7" r="8" fill="white" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Connect Instantly. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]">
            Collaborate Seamlessly.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-light">
          Experience real-time messaging with an internship-ready platform designed for speed, security, and exceptional user experience.
        </p>

        <button 
          onClick={() => navigate("/auth")}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#007AFF] hover:bg-[#005bb5] transition-all duration-300 rounded-full shadow-[0_0_20px_rgba(0,122,255,0.3)] hover:shadow-[0_0_30px_rgba(0,122,255,0.6)] overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Get Started
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </span>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%]"></div>
        </button>
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute bottom-10 animate-bounce text-slate-500">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
};

export default Landing;
