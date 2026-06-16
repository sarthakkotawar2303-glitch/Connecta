import { Camera, Loader2 } from "lucide-react";

const SignupForm = ({ onSubmit, loading, error, preview, handleChange, handleTabSwitch }) => {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="space-y-4"
    >
      {error && (
        <div className="bg-red-50 border border-error/20 text-error text-xs p-3.5 rounded-[4px] font-sans text-center">
          {error}
        </div>
      )}

      <div>
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          onChange={handleChange}
          className="w-full bg-white border border-[#A0AEC0] text-[#0B192C] placeholder-[#A0AEC0] px-4 py-2.5 rounded-[6px] focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0]/30 transition text-sm font-sans"
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          onChange={handleChange}
          className="w-full bg-white border border-[#A0AEC0] text-[#0B192C] placeholder-[#A0AEC0] px-4 py-2.5 rounded-[6px] focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0]/30 transition text-sm font-sans"
        />
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full bg-white border border-[#A0AEC0] text-[#0B192C] placeholder-[#A0AEC0] px-4 py-2.5 rounded-[6px] focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0]/30 transition text-sm font-sans"
        />
      </div>

      <div>
        <div className="flex items-center gap-4 bg-[#F7FAFC] border border-[#E2E8F0] p-3 rounded-[6px]">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-10 h-10 rounded-[6px] object-cover border border-[#E2E8F0] flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-400 flex-shrink-0 rounded-[6px]">
              <Camera className="w-4.5 h-4.5" />
            </div>
          )}
          <label className="flex-1 cursor-pointer bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-[6px] px-3 py-2 text-xs text-slate-700 font-sans font-medium transition text-center uppercase tracking-wider select-none">
            Upload Avatar
            <input
              type="file"
              name="pic"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2B6CB0] hover:bg-[#205080] text-white py-3 font-semibold transition rounded-[6px] disabled:opacity-50 mt-4 flex justify-center items-center cursor-pointer text-sm font-sans"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Register Account"
        )}
      </button>

      <div className="mt-4 text-center text-xs text-slate-600 font-sans">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => handleTabSwitch(true)}
          className="text-[#2B6CB0] hover:underline font-semibold cursor-pointer"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
