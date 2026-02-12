import { useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await client.post("/api/forgot-password", { email });
      setSent(true);
    } catch {
      setError("Errore di connessione. Riprova tra qualche istante.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center app-shell px-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-gradient mb-2">Spendify</h1>
        <p className="text-sm text-slate-400 mb-6">Password dimenticata</p>

        {sent ? (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-4 text-sm text-green-700 dark:text-green-400">
            <p className="font-semibold mb-1">Email inviata!</p>
            <p>
              Se l&apos;indirizzo è registrato, riceverai le istruzioni per
              reimpostare la password. Controlla anche la cartella spam.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Inserisci la tua email e ti invieremo un link per reimpostare la
              password.
            </p>
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
              {submitting ? "Invio in corso..." : "Invia link di reset"}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-slate-400">
          <Link to="/login" className="text-indigo-500 hover:underline cursor-pointer">
            Torna al login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
