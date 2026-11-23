export default function StatCard({ titulo, valor }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm uppercase tracking-wide text-gray-500">{titulo}</p>
      <p className="text-3xl mt-2">{valor}</p>
    </div>
  );
}
