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

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400">oppure</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <a
          href={`${import.meta.env.VITE_API_URL || ""}/api/auth/google`}
          className="flex items-center justify-center gap-3 w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continua con Google
        </a>

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
