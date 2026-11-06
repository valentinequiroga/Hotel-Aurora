import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import AuthCard from "../../components/ui/AuthCard";
import { isValidEmail } from "../../utils/format";

const EMPTY = { name: "", email: "", phone: "", password: "", confirm: "" };

// Validación campo por campo para mostrar el error debajo de cada input
function validate(form) {
  const errors = {};
  if (form.name.trim().length < 3) errors.name = "Ingresá tu nombre y apellido.";
  if (!isValidEmail(form.email)) errors.email = "Ingresá un email válido.";
  if (form.phone && !/^[\d\s+-]{6,}$/.test(form.phone)) errors.phone = "Solo números, espacios o guiones.";
  if (form.password.length < 6) errors.password = "Mínimo 6 caracteres.";
  if (form.confirm !== form.password) errors.confirm = "Las contraseñas no coinciden.";
  return errors;
}

function Field({ id, label, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} name={id} className={`input ${error ? "border-bad-text" : ""}`} aria-invalid={Boolean(error)} {...props} />
      {error && <p className="mt-1 text-xs text-bad-text">{error}</p>}
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const location = useLocation();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const result = register(form);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    // Al quedar con sesión, GuestOnlyRoute redirige solo
    toast.success("¡Cuenta creada! Ya podés reservar.");
  };

  return (
    <AuthCard
      title="Crear cuenta"
      subtitle="Registrate para reservar y seguir tus estadías."
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" state={location.state} className="font-medium text-primary hover:underline">
            Ingresá
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field id="name" label="Nombre y apellido" autoComplete="name" value={form.name} onChange={handleChange} error={errors.name} />
        <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} />
        <Field id="phone" label="Teléfono (opcional)" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} error={errors.phone} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="password" label="Contraseña" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} error={errors.password} />
          <Field id="confirm" label="Repetir contraseña" type="password" autoComplete="new-password" value={form.confirm} onChange={handleChange} error={errors.confirm} />
        </div>

        {formError && (
          <p role="alert" className="rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad-text">{formError}</p>
        )}

        <button type="submit" className="btn-primary w-full">Crear cuenta</button>
      </form>
    </AuthCard>
  );
}
