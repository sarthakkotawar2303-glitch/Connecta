import { Loader2 } from "lucide-react";

const LoginForm = ({ onSubmit, loading, error, handleChange, handleTabSwitch }) => {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="space-y-4"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3.5 rounded-[4px] font-sans text-center">
          {error}
        </div>
      )}

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          onChange={handleChange}
          className="w-full bg-white border border-[#A0AEC0] text-[#0B192C] placeholder-[#A0AEC0] px-4 py-3 rounded-[6px] focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0]/30 transition text-sm font-sans"
        />
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full bg-white border border-[#A0AEC0] text-[#0B192C] placeholder-[#A0AEC0] px-4 py-3 rounded-[6px] focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0]/30 transition text-sm font-sans"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2B6CB0] hover:bg-[#205080] text-white py-3 font-semibold transition rounded-[6px] disabled:opacity-50 mt-2 flex justify-center items-center cursor-pointer text-sm font-sans"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Sign In"
        )}
      </button>



      <div className="mt-4 text-center text-xs text-slate-600 font-sans">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => handleTabSwitch(false)}
          className="text-[#2B6CB0] hover:underline font-semibold cursor-pointer"
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
