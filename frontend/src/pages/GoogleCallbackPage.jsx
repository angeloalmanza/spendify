import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import client from "../api/client";

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("auth_token", token);

    client.get("/api/user").then((res) => {
      setUser(res.data);
      navigate("/");
    }).catch(() => {
      localStorage.removeItem("auth_token");
      navigate("/login");
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center app-shell">
      <p className="text-slate-400 text-sm">Accesso in corso...</p>
    </div>
  );
};

export default GoogleCallbackPage;
