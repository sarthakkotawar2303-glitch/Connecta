const SignupForm = ({ onSubmit, loading, error, preview, handleChange }) => {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="space-y-4"
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-slate-400 mb-1">Username</label>
        <input
          type="text"
          name="username"
          placeholder="yourname"
          required
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          required
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">
          Profile Picture <span className="text-slate-600">(optional)</span>
        </label>
        <div className="flex items-center gap-4">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-12 h-12 rounded-full object-cover border-2 border-violet-500 flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-500 text-xs flex-shrink-0">
              No img
            </div>
          )}
          <label className="flex-1 cursor-pointer border border-dashed border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:border-violet-500 hover:text-violet-400 transition text-center">
            Choose photo
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
        className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center mt-2"
      >
        {loading
          ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : "Create Account"
        }
      </button>
    </form>
  );
};

export default SignupForm;