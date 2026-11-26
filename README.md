# Hotel Aurora – Hotel Management Web App

Hotel management web application with online booking. Guests can book rooms and check their reservations, and the hotel staff manage everything from an admin panel.  
Team project for **Development Platforms** at Escuela Da Vinci (Buenos Aires).

## Tech stack
- React (functional components + hooks)
- Context API for shared state (`DataContext`, `AuthContext`)
- localStorage for data persistence
- Git + GitHub (Conventional Commits)

## Team & contributions
Valentina Quiroga – Admin panel
I built the admin side of the app:
- **Occupancy grid:** 90-day calendar view showing which rooms are booked each day, with color-coded reservation blocks by status, guest names and a status legend. Room names stay fixed while the days scroll horizontally.
- **Reservations management:** table with all bookings, status filter, and actions to confirm or cancel a reservation. Changes are saved in the shared context, so guests see the updated status in "My reservations".
- **Rooms management:**
  - Table with type, capacity, price per night and status
  - Activate / deactivate rooms with one click
  - Edit rooms in a reusable modal form (`Modal` with React portals + `RoomForm`)
  - Delete protection: a room can't be deleted if it has active reservations
- **Reusable UI components:** `Modal` (rendered with React portals) and `StatCard` for dashboard metrics, plus status badges, hover states and consistent styling with Tailwind

Abril Gullotta – Project base, accounts and roles: project setup, authentication and user roles (admin / guest)
Franco Di Giovanni – Guest side: room browsing, booking flow and "My reservations"

## How to run
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open the local URL shown in the terminal


