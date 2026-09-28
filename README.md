# Digital Attendance Monitoring System

React/Vite frontend with a PHP/MySQL API for student and attendance management.

## Database setup

1. Start Apache and MySQL in XAMPP.
2. Open phpMyAdmin and import `database.sql` into MySQL.
3. Import `database_users.sql` as well. It creates the separate `attendance_system_users` database used by the Student Portal for profiles, attendance history, and check-in logs.
4. The PHP connections default to `localhost`, user `root`, and an empty password. Update `PHP/server.php` and `PHP/user_database.php` if your MySQL credentials differ.

`attendance_system_users` contains its own `students`, `attendance`, and `attendance_logs` tables. Student registration and check-ins are mirrored there while the administrator keeps its matching records in `attendance_system`.

Seed administrator:

- Email: `admin@school.com`
- Password: `password`

## Run the app

From the project folder:

```bash
npm install
npm run dev
```

The frontend calls the PHP API at `http://localhost/attendance_system/PHP`. Set `VITE_API_URL` when the project is hosted at another URL.

Available data workflows include student CRUD/search, attendance search/filter/CSV export, date-range reports, subject/schedule settings, administrator profile updates, authentication, and database-backed QR session generation.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
