import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { ROLES, ROLE_LABELS } from "../../data/constants";
import { formatDate } from "../../utils/dates";
import PageHeader from "../../components/ui/PageHeader";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function AdminUsers() {
  const { user: me, users, updateUserRole, deleteUser, countActiveReservations } = useAuth();
  const { getReservationsByUser } = useData();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [toDelete, setToDelete] = useState(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users
      .filter((u) => roleFilter === "todos" || u.role === roleFilter)
      .filter((u) => !term || u.name.toLowerCase().includes(term) || u.email.includes(term))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users, search, roleFilter]);

  const totals = {
    all: users.length,
    admins: users.filter((u) => u.role === ROLES.ADMIN).length,
    guests: users.filter((u) => u.role === ROLES.GUEST).length,
  };

  const handleRoleChange = (target, role) => {
    const result = updateUserRole(target.id, role);
    if (result.ok) toast.success(`${target.name} ahora es ${ROLE_LABELS[role].toLowerCase()}.`);
    else toast.error(result.error);
  };

  const handleDelete = () => {
    const result = deleteUser(toDelete.id);
    if (result.ok) toast.success(`Se eliminó la cuenta de ${toDelete.name}.`);
    else toast.error(result.error);
    setToDelete(null);
  };

  return (
    <>
      <PageHeader
        title="Usuarios"
        subtitle={`${totals.all} cuentas · ${totals.admins} de recepción · ${totals.guests} huéspedes`}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          className="input sm:max-w-xs"
          placeholder="Buscar por nombre o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar usuarios"
        />
        <select className="input sm:w-48" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="Filtrar por rol">
          <option value="todos">Todos los roles</option>
          <option value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</option>
          <option value={ROLES.GUEST}>{ROLE_LABELS[ROLES.GUEST]}</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="eyebrow border-b border-line">
            <tr>
              <th className="px-6 py-4 font-medium">Usuario</th>
              <th className="px-6 py-4 font-medium">Teléfono</th>
              <th className="px-6 py-4 font-medium">Alta</th>
              <th className="px-6 py-4 font-medium">Reservas</th>
              <th className="px-6 py-4 font-medium">Rol</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((u) => {
              const isMe = u.id === me.id;
              const total = getReservationsByUser(u.id).length;
              const active = countActiveReservations(u.id);
              return (
                <tr key={u.id} className="transition hover:bg-bg">
                  <td className="px-6 py-5">
                    <p className="font-medium">
                      {u.name} {isMe && <span className="ml-1 text-xs text-muted">(vos)</span>}
                    </p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{u.phone || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(u.createdAt)}</td>
                  <td className="px-6 py-5">
                    {total}
                    {active > 0 && <span className="ml-1 text-xs text-warn-text">({active} activas)</span>}
                  </td>
                  <td className="px-6 py-5">
                    <select
                      className="input w-auto py-1.5"
                      value={u.role}
                      disabled={isMe}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                      aria-label={`Rol de ${u.name}`}
                    >
                      <option value={ROLES.GUEST}>{ROLE_LABELS[ROLES.GUEST]}</option>
                      <option value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      className="rounded-card px-3 py-1.5 text-sm font-medium text-bad-text hover:bg-bad-bg disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={isMe}
                      onClick={() => setToDelete(u)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No hay usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar cuenta"
        message={toDelete ? `¿Seguro que querés eliminar la cuenta de ${toDelete.name}? Esta acción no se puede deshacer.` : ""}
        confirmLabel="Eliminar"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
