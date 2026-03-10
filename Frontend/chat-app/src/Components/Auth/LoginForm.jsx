const LoginForm = ({ onSubmit, loading, error, handleChange }) => {
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center mt-2"
      >
        {loading
          ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : "Sign In"
        }
      </button>
    </form>
  );
};

export default LoginForm;