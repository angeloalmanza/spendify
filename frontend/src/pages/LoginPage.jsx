import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 422) {
        setError(
          "Email o password errati. Non hai ancora un account? Registrati.",
        );
      } else {
        setError("Errore di connessione. Riprova tra qualche istante.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center app-shell px-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-gradient mb-2">
          Spendify
        </h1>
        <p className="text-sm text-slate-400 mb-6">Accedi al tuo account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-500 hover:underline"
              >
                Password dimenticata?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}{" "}
              {error.includes("Registrati") && (
                <Link to="/register" className="font-semibold underline">
                  Registrati
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary h-10 rounded-lg disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Accesso..." : "Accedi"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Non hai un account?{" "}
          <Link
            to="/register"
            className="text-indigo-500 hover:underline cursor-pointer"
          >
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
