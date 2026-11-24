import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import AuthCard from "../../components/ui/AuthCard";


export default function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Ingresá tu email y tu contraseña.");
      return;
    }
    const result = login(form.email, form.password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    // La redirección (a la página que quería ver, o según su rol) la hace GuestOnlyRoute
    toast.success(`¡Hola, ${result.user.name.split(" ")[0]}!`);
  };

  return (
    <AuthCard
      title="Ingresar"
      subtitle={from ? "Iniciá sesión para continuar con tu reserva." : "Bienvenida/o de nuevo a Aurora."}
      footer={
        <>
          ¿Todavía no tenés cuenta?{" "}
          <Link to="/registro" state={location.state} className="font-medium text-primary hover:underline">
            Registrate
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" className="input" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password" className="label">Contraseña</label>
          <input id="password" name="password" type="password" autoComplete="current-password" className="input" value={form.password} onChange={handleChange} />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad-text">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full">Ingresar</button>
      </form>
    </AuthCard>
  );
}
