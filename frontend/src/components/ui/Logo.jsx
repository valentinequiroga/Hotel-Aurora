// Logotipo: la palabra "Aurora" en Playfair Display, como en la guía de estilo
export default function Logo({ light = false, size = "text-2xl" }) {
  return (
    <span className={`font-display ${size} font-medium tracking-tight ${light ? "text-white" : "text-primary"}`}>
      Aurora
    </span>
  );
}
