// Pantalla provisoria para las secciones que todavía no se hicieron.
// Cada integrante reemplaza su placeholder por la página real.
export default function Placeholder({ title, owner, todo = [], inPanel = false }) {
  return (
    <div className={inPanel ? "" : "mx-auto max-w-6xl px-6 py-16"}>
      <span className="accent-rule" aria-hidden="true" />
      <h1 className="text-4xl md:text-5xl">{title}</h1>
      <div className="card mt-8 max-w-2xl border-dashed">
        <p className="eyebrow">En construcción · {owner}</p>
        {todo.length > 0 && (
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            {todo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
