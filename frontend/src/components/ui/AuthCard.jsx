// Contenedor visual compartido por Login y Registro:
// panel azul noche con el mensaje de la marca + formulario en tarjeta blanca
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
      <div className="grid overflow-hidden rounded-card bg-surface shadow-md md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-primary p-12 md:flex">
          <span className="font-display text-2xl text-white">Aurora</span>
          <div>
            <span className="accent-rule" aria-hidden="true" />
            <p className="font-display text-4xl leading-tight text-white">
              Descansá donde la luz es mejor.
            </p>
            <p className="mt-4 text-sm text-white/70">
              Reservá tu estadía en Hotel Aurora en pocos pasos.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <span className="accent-rule" aria-hidden="true" />
          <h1 className="text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 border-t border-line pt-5 text-sm text-muted">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
