import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(err?.response?.data?.message || "Registrazione fallita");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center app-shell px-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-gradient mb-2">
          Expense Tracker
        </h1>
        <p className="text-sm text-slate-400 mb-6">Crea il tuo account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary h-10 rounded-lg disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Registrazione..." : "Registrati"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Hai già un account?{" "}
          <Link
            to="/login"
            className="text-indigo-500 hover:underline cursor-pointer"
          >
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
