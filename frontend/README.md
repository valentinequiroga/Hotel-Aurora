# Hotel Aurora · Reservas

Sitio de reservas para un hotel chico e inventado de 10 habitaciones. Trabajo práctico de **Plataformas de Desarrollo** (comisión ACN4AV).

Hecho con **React + Vite**, **React Router**, **Tailwind CSS** y **React Toastify**. No consume una API: los datos están hardcodeados en `src/data/seeds.js` y se guardan en `localStorage`.

## Cómo correrlo

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # genera la carpeta dist/ para la entrega
npm run preview  # sirve el build para probarlo
```

## Cuentas de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador (recepción) | recepcion@aurora.com | admin123 |
| Huésped | lucia@mail.com | lucia123 |
| Huésped | martin@mail.com | martin123 |
| Huésped | carla@mail.com | carla123 |

En la pantalla de login hay botones para completar estas cuentas. En el footer, **Restablecer datos demo** vuelve todo al estado inicial.

## Rutas

| Ruta | Acceso | Responsable |
|---|---|---|
| `/` Inicio | Público | B |
| `/habitaciones` | Público | B |
| `/mis-reservas` | Con sesión | B |
| `/login`, `/registro` | Solo sin sesión | A |
| `/admin` Resumen | Admin | C |
| `/admin/ocupacion` | Admin | C |
| `/admin/reservas` | Admin | C |
| `/admin/habitaciones` | Admin | C |
| `/admin/usuarios` | Admin | A |
| `*` 404 | Público | A |

## Estructura

```
src/
├── components/
│   ├── layout/        Navbar, Footer, MainLayout, AdminLayout
│   ├── ui/            Piezas reutilizables (PageHeader, ConfirmDialog, Logo, ...)
│   ├── guest/         (B) RoomCard, SearchBar, ReservationModal...
│   └── admin/         (C) StatCard, RoomForm, Modal, OccupancyGrid...
├── context/
│   ├── AuthContext.jsx   usuarios, sesión, roles  → useAuth()
│   └── DataContext.jsx   habitaciones y reservas  → useData()
├── data/
│   ├── constants.js      roles, estados, servicios extra, claves de storage
│   └── seeds.js          datos iniciales
├── hooks/useLocalStorage.js
├── pages/
│   ├── auth/   Login, Register                  (A)
│   ├── guest/  Home, Rooms, MyReservations      (B)
│   └── admin/  AdminUsers (A) · Dashboard, Occupancy, AdminRooms, AdminReservations (C)
├── routes/ProtectedRoute.jsx
└── utils/  dates.js, format.js
```

Las páginas de B y C ya existen como **placeholder** con la lista de lo que falta. Cada uno reemplaza el contenido de su archivo sin tocar `App.jsx`.

## Cómo usar la base (para B y C)

**Sesión y roles**

```jsx
const { user, isLoggedIn, isAdmin, getUserById } = useAuth();
```

`user` tiene `id, name, email, phone, role, createdAt` (nunca la contraseña).

**Habitaciones y reservas**

```jsx
const { rooms, setRooms, reservations, setReservations, getRoomById, getReservationsByUser } = useData();

// agregar
setReservations((prev) => [...prev, nueva]);
// modificar
setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
```

Todo lo que se guarda con `setRooms` / `setReservations` queda en `localStorage` solo.

**Forma de los datos**

```js
// Habitación
{ id, number, name, type, capacity, beds, pricePerNight, size, active, description, amenities: [], image }

// Reserva (fechas como "YYYY-MM-DD"; checkOut es el día de salida, esa noche no se cobra)
{ id, userId, roomId, checkIn, checkOut, guests, extras: ["desayuno"], total, status, createdAt }
```

**Constantes útiles** (`src/data/constants.js`)

- `RESERVATION_STATUS` y `STATUS_META[estado]` → texto y colores para badges y para la grilla.
- `ACTIVE_STATUSES` → estados que ocupan la habitación (para disponibilidad y para no borrar).
- `EXTRAS` → servicios extra con su precio y cómo se cobran.

**Fechas** (`src/utils/dates.js`): `todayISO`, `addDays`, `nightsBetween`, `rangesOverlap`, `formatDate`.
**Formato** (`src/utils/format.js`): `formatCurrency`, `generateId`.

**Estilos**: seguir la guía de estilo de Hotel Aurora (limpio, moderno y elegante; mucho espacio en blanco; el dorado solo para detalles y hover). Las variables de la guía están en `src/index.css` y se usan como clases de Tailwind:

| Variable | Valor | Clase |
|---|---|---|
| `--color-bg` | #FAF8F5 | `bg-bg` |
| `--color-surface` | #FFFFFF | `bg-surface` |
| `--color-text` | #1F2933 | `text-text` |
| `--color-muted` | #5B6470 | `text-muted` |
| `--color-primary` (azul noche) | #1E2A44 | `bg-primary`, `text-primary` |
| `--color-accent` (dorado) | #C9A86A | `bg-accent`, `hover:text-accent` |
| `--color-line` | #E5E1DA | `border-line` |
| Estados | ok / warn / bad | `bg-ok-bg text-ok-text`, `bg-warn-bg text-warn-text`, `bg-bad-bg text-bad-text` |

- Títulos en **Playfair Display** (todos los `h1`, `h2`, `h3` ya la usan; para otro texto: `font-display`). Texto y botones en **Inter**.
- Radio `rounded-card` (12px), sombras `shadow-sm` (tarjetas) y `shadow-md` (hover y buscador).
- Clases listas: `btn-primary` (azul, hover dorado), `btn-secondary` (blanco con borde), `btn-light` (blanco sobre azul), `btn-danger`, `input`, `label`, `card`, `eyebrow` (etiquetas en mayúscula como LLEGADA), `badge` y `accent-rule` (la línea dorada corta arriba de los títulos).
- `<PageHeader title="..." actions={...} />` ya trae la línea dorada y el título grande.

**Avisos**: `import { toast } from "react-toastify"` → `toast.success("...")`, `toast.error("...")`.

**Modales**: `index.html` tiene un `<div id="modal">` para `createPortal`. `ConfirmDialog` ya lo usa.

## Reglas de usuarios (Persona A)

- Las cuentas nuevas siempre se crean como huésped.
- Un admin no puede cambiar su propio rol ni eliminarse.
- Siempre queda al menos un administrador.
- No se puede eliminar un usuario con reservas activas (pendiente, confirmada o check-in).
- La sesión guarda solo el id del usuario: si recepción le cambia el rol o borra la cuenta, se refleja al instante.

> Nota: al ser un proyecto solo de frontend, las contraseñas se guardan en `localStorage` sin cifrar. En una versión con backend se validarían en el servidor.

## Reparto

- **A · Base y cuentas**: estructura, datos, seguridad, login, registro, gestión de usuarios, 404, layout, README y build.
- **B · Lado huésped**: home, habitaciones, búsqueda y disponibilidad, reserva con extras, mis reservas.
- **C · Lado admin**: dashboard, ABM de habitaciones, gestión de reservas, grilla de ocupación.
