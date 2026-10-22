# Autos EX — Big One Rent a Car

Sistema de alquiler de autos (rent a car) para Santa Cruz, Bolivia. Incluye un sitio publico con catalogo de vehiculos y reservas en linea, y un panel de administracion para gestionar la flota, las reservas, los clientes, las finanzas y el contenido.

El proyecto esta dividido en dos partes que trabajan juntas: una API en el backend (Laravel) y una aplicacion web en el frontend (React + Vite).

---

## Stack tecnologico

- Backend: PHP 8.3, Laravel 13, base de datos SQLite, autenticacion de administrador con token (Sanctum).
- Frontend: React 18 con Vite, TailwindCSS y React Router.
- Pagos: QR / transferencia para clientes nacionales y pasarela Libelula (Todotix) para clientes extranjeros.

---

## Estructura de carpetas

```
Autos_EX/
  backend/                     API en Laravel
    app/
      Models/                  Modelos de datos (Vehiculo, BigoneReserva, Cliente, ...)
      Http/Controllers/Api/    Controladores de la API
      Http/Middleware/         Middlewares (autenticacion, etc.)
    routes/
      api.php                  Definicion de todos los endpoints de la API
    database/
      migrations/              Estructura de las tablas (se aplican con artisan migrate)
      database.sqlite          Base de datos real (NO se incluye en el repo)
    config/                    Configuracion de Laravel
    storage/                   Archivos subidos, logs y cache (NO se incluye)
    .env.example               Ejemplo de variables de entorno

  frontend/                    Aplicacion web en React (Vite)
    src/
      pages/                   Paginas publicas y del panel admin
        admin/                 Panel de administracion
      components/              Componentes reutilizables (CarCard, Navbar, Footer, ...)
      hooks/                   Hooks (useVehiculos, useSettings)
      lib/
        api.js                 Cliente que llama a la API del backend
      context/                 Estado global (sesion de admin)
    public/
      images/                  Imagenes (autos, logos, hero)
    .env                       Variable VITE_API_URL (NO se incluye)

  deploy-ftp.ps1               Script de despliegue por FTP (frontend + backend)
```

---

## Que hace cada parte

### Backend (API)

Expone una API REST. Las rutas estan en `backend/routes/api.php`. Hay rutas publicas (las que usa el sitio sin login) y rutas de administrador protegidas por token.

Rutas publicas principales:

- `GET /api/vehiculos` — catalogo de autos (lo consume el catalogo del sitio).
- `GET /api/vehiculos/{id}/disponibilidad` — verifica si un auto esta libre en un rango de fechas.
- `GET /api/settings` — configuracion general del sitio.
- `GET /api/tiktok-videos` — videos para la seccion Redes.
- `POST /api/bigone/reservas` — registra una reserva.
- `POST /api/bigone/intentos` — registra un intento de reserva (seguimiento).
- `POST /api/bigone/garantias` — registra un deposito de garantia.
- `POST /api/bigone/upload-doc` — recibe documentos del cliente (CI, licencia, etc.).

Rutas de administrador (bajo `/api/admin`, requieren login): CRUD de vehiculos, reservas, clientes, finanzas, garantias, videos, usuarios y logs.

### Frontend

Aplicacion de una sola pagina (SPA). Se divide en el sitio publico y el panel de administracion.

Sitio publico (`src/pages`):

- `Home` — portada con hero, estadisticas y vehiculos destacados.
- `Catalogo` — lista completa de vehiculos con filtro por categoria y orden. Lee los autos desde `GET /api/vehiculos`.
- `Requisitos` — requisitos para alquilar.
- `Contacto` y `Redes` — informacion de contacto y redes sociales.
- `Reservar` y `ReservaExitosa` — flujo de reserva y confirmacion.
- `PagoServicios` — pago de saldos pendientes.

El componente clave es `components/CarCard.jsx`: muestra la tarjeta del auto y contiene todo el flujo de reserva (modal con pasos: nacionalidad, documentos, aviso y pago). Los clientes nacionales pagan por QR o transferencia; los extranjeros por la pasarela Libelula.

Panel de administracion (`src/pages/admin`): Dashboard, Vehiculos, Reservas, Agenda, Clientes, Finanzas, Garantias, Redes, Usuarios y Logs. El layout del panel esta en `components/admin/AdminLayout.jsx`.

La comunicacion con el backend pasa siempre por `src/lib/api.js`, que usa la variable `VITE_API_URL`.

---

## Como levantarlo en local

Requisitos: PHP 8.3, Composer y Node.js 18 o superior.

### 1. Backend

```
cd backend
composer install
copiar .env.example a .env
php artisan key:generate
```

Crear la base SQLite y migrar:

```
(crear el archivo vacio) backend/database/database.sqlite
php artisan migrate
php artisan serve
```

El backend queda en `http://localhost:8000`.

### 2. Frontend

```
cd frontend
npm install
```

Crear un archivo `.env` con la URL del backend:

```
VITE_API_URL=http://localhost:8000/api
```

Luego:

```
npm run dev
```

El sitio queda en el puerto que indique Vite.

Importante sobre el entorno: en Vite, el archivo `.env.local` tiene prioridad sobre `.env` incluso al compilar para produccion. Si existe un `.env.local` apuntando a `localhost`, antes de hacer `npm run build` para produccion hay que desactivarlo o corregirlo, o el sitio compilado quedara apuntando a localhost.

### 3. Build de produccion

```
cd frontend
npm run build
```

Genera la carpeta `frontend/dist` lista para subir al servidor.

---

## Notas de seguridad

Por decision de este repositorio NO se incluyen:

- Los archivos `.env` (contienen claves y configuracion).
- La base de datos `database/database.sqlite` (datos reales).
- Los archivos subidos por clientes en `storage/app` (documentos personales).

La clave `LIBELULA_APPKEY` del frontend es una llave de la pasarela de pago que se usa del lado del cliente (ya viaja en el bundle publico del sitio). Tenerla presente al revisar el codigo.
