import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import client from "../api/client";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Le password non coincidono.");
      return;
    }

    setSubmitting(true);
    try {
      await client.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success("Password reimpostata! Ora puoi accedere.");
      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message ?? "Il link non è valido o è scaduto."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center app-shell px-4">
        <div className="glass-card rounded-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-semibold text-gradient mb-4">Spendify</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Link non valido. Richiedi un nuovo link di reset.
          </p>
          <Link to="/forgot-password" className="text-indigo-500 hover:underline text-sm">
            Richiedi nuovo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center app-shell px-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-gradient mb-2">Spendify</h1>
        <p className="text-sm text-slate-400 mb-6">Reimposta la password</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Nuova password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Conferma password
            </label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
                setError(null);
              }}
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary h-10 rounded-lg disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Salvataggio..." : "Reimposta password"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          <Link to="/login" className="text-indigo-500 hover:underline cursor-pointer">
            Torna al login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
