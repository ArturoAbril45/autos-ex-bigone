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

  deploy-ftp.ps1                Script de despliegue por FTP (frontend + backend)
  check-migrations.ps1          Verifica por FTP que ciertas migraciones ya corrieron en produccion
  check-trash.ps1               Lista el contenido de /.trash y otras carpetas del servidor por FTP
  test-ftp-login.ps1            Prueba que las credenciales FTP conecten (lista la carpeta raiz)
  test-ftp-listdirs.ps1         Lista el contenido de /public_html y /laravel_app por FTP
  upload-migrate-script.ps1     Sube migrate_tmp.php al servidor (ver seccion de despliegue)
  upload-check-script.ps1       Sube check_migrations_table.php al servidor
  upload-reset-script.ps1       Sube reset_db_tmp.php al servidor
  upload-seed-script.ps1        Sube seed_admin_tmp.php al servidor
  migrate_tmp.php                Corre "php artisan migrate" en el servidor via navegador
  check_migrations_table.php     Reporta el estado de la base de datos en el servidor via navegador
  reset_db_tmp.php               Corre "php artisan migrate:fresh" en el servidor via navegador
  seed_admin_tmp.php             Recrea el usuario admin en el servidor via navegador
```

Nota: los scripts `.ps1` y los archivos `*_tmp.php` / `check_migrations_table.php` de la raiz NO se suben al repositorio (estan en `.gitignore`) porque contienen rutas, usuario FTP y una clave de acceso de un solo proposito. Siguen existiendo en el disco local de esta maquina; esta seccion documenta solo para que sirve cada uno, no sus valores.

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

## Requisitos previos

Versiones usadas para desarrollar este proyecto (comprobadas en esta maquina):

- PHP 8.3 (probado con 8.3.30), con las extensiones habituales de Laravel (pdo_sqlite, mbstring, openssl, tokenizer, ctype, json, fileinfo).
- Composer 2.x (probado con 2.9.7).
- Node.js 18 o superior (probado con 24.12.0). El `package.json` del frontend no fija una version minima, pero Vite 8 y React 19 requieren Node relativamente reciente; si algo falla con Node 18, probar con Node 20 LTS o superior.
- npm (incluido con Node; probado con 11.6.2).
- Git.
- SQLite no necesita instalarse aparte: PHP la trae integrada mediante la extension `pdo_sqlite`.

No se necesita MySQL/MariaDB, Redis ni un servidor de colas aparte: `backend/.env.example` usa `DB_CONNECTION=sqlite`, `SESSION_DRIVER=database`, `CACHE_STORE=database` y `QUEUE_CONNECTION=database`, todo contra el mismo archivo SQLite.

## Instalacion desde cero

### 0. Clonar el repositorio

```
git clone https://github.com/ArturoAbril45/autos-ex-bigone.git
cd autos-ex-bigone
```

### 1. Backend

```
cd backend
composer install
```

Copiar el archivo de entorno de ejemplo y generar la clave de la aplicacion:

```
cp .env.example .env
php artisan key:generate
```

Variables de `backend/.env` que normalmente hay que revisar o completar segun el entorno:

- `APP_URL` — URL donde corre el backend (`http://localhost:8000` en local).
- `DB_CONNECTION=sqlite` — no requiere host/usuario/password porque usa un archivo SQLite; las variables `DB_HOST`, `DB_DATABASE`, etc. quedan comentadas y se pueden ignorar en local.
- `MAIL_*` — opcional en local (por defecto `MAIL_MAILER=log`, los correos solo se escriben en el log).
- Cualquier clave de la pasarela de pago (Libelula) si se prueba el flujo de pago para clientes extranjeros; ver `frontend` para la clave publica del lado del cliente.

Crear el archivo de base de datos SQLite (vacio) y aplicar las migraciones:

```
touch database/database.sqlite
php artisan migrate
```

En Windows sin `touch`, basta crear un archivo vacio llamado `database.sqlite` dentro de `backend/database/` (por ejemplo desde el explorador de archivos, o con `New-Item backend/database/database.sqlite` en PowerShell).

Ejecutar los seeders (opcional pero recomendado en local, crea un usuario administrador de prueba para poder entrar al panel):

```
php artisan db:seed
```

El seeder (`backend/database/seeders/DatabaseSeeder.php`) crea el usuario `admin@bigone.com` si no existe. La contrasena de ese usuario de prueba esta definida en el propio archivo del seeder; revisarlo localmente para conocerla (no se repite aqui para no exponerla mas de lo necesario).

Levantar el servidor de desarrollo:

```
php artisan serve
```

El backend queda escuchando en `http://localhost:8000` (puerto por defecto de `artisan serve`; si el 8000 esta ocupado, Laravel lo indica en la consola y hay que ajustar `VITE_API_URL` en el frontend).

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

El sitio queda en `http://localhost:5173` (puerto por defecto de Vite). Si el 5173 esta ocupado, Vite elige el siguiente puerto libre (5174, 5175, ...) y lo muestra en la consola al iniciar.

Importante sobre el entorno: en Vite, el archivo `.env.local` tiene prioridad sobre `.env` incluso al compilar para produccion. Si existe un `.env.local` apuntando a `localhost`, antes de hacer `npm run build` para produccion hay que desactivarlo o corregirlo, o el sitio compilado quedara apuntando a localhost.

### 3. Build de produccion

```
cd frontend
npm run build
```

Genera la carpeta `frontend/dist` lista para subir al servidor.

---

## Despliegue a produccion

El hosting del proyecto (`bigonerentacar.online`) se actualiza por FTP, sin acceso SSH y sin terminal del servidor para Composer/NPM. Por eso el despliegue consiste en compilar todo localmente y subir los archivos ya listos, y en usar pequenos scripts PHP accedidos por navegador para correr comandos de Artisan en el servidor (migraciones, seeders, etc.) cuando cPanel no ofrece una terminal.

Estructura en el servidor (segun los scripts):

- `/public_html` — raiz publica del dominio; ahi vive el `index.html` del frontend compilado (`frontend/dist`).
- `/laravel_app` — el backend Laravel completo (fuera de `public_html` por seguridad).

### Despliegue normal (`deploy-ftp.ps1`)

Es el script principal, el que se usa en el dia a dia para publicar cambios. Desde la raiz del proyecto:

```
./deploy-ftp.ps1
```

Que hace, en orden:

1. Pide la contrasena FTP por consola (nunca queda escrita en el script ni en el repositorio).
2. Compila el frontend (`npm run build` dentro de `frontend/`).
3. Sube el contenido de `frontend/dist` a `/public_html`.
4. Sube `backend/` completo a `/laravel_app`, excluyendo `.env`, `.env.production`, `storage`, `.git`, `node_modules`, `vendor` y `database.sqlite` (para no pisar la configuracion, los datos reales ni los paquetes ya instalados en el servidor).
5. Al final recuerda el paso manual pendiente: entrar a la Terminal de cPanel (si esta disponible) y correr `php artisan migrate --force` dentro de `/laravel_app` (y `composer install --no-dev` si es la primera subida del backend).

Antes de usarlo hay que revisar las variables `$FtpHost`, `$FtpUser`, `$RemoteFrontendPath` y `$RemoteBackendPath` al inicio del archivo, por si cambian el hosting o las rutas.

### Scripts de diagnostico FTP

- `test-ftp-login.ps1` — prueba rapida de que el usuario/contrasena FTP conectan; lista la carpeta raiz del hosting.
- `test-ftp-listdirs.ps1` — lista el contenido de `/public_html` y `/laravel_app` (para confirmar que el ultimo deploy subio lo esperado).
- `check-trash.ps1` — lista `/.trash`, `/laravel_app/database` y `/laravel_app/storage/backups` (utilidad para revisar archivos borrados o respaldos que algunos hostings guardan en una papelera FTP).
- `check-migrations.ps1` — lista `/laravel_app/database/migrations` por FTP y verifica puntualmente si tres migraciones especificas (los nombres estan escritos dentro del script) ya se subieron al servidor.

### Scripts para correr Artisan en el servidor sin terminal (uso excepcional)

Cuando el hosting no tiene terminal disponible desde cPanel, estos pares de archivos permiten ejecutar un comando de Artisan abriendo una URL en el navegador:

| Sube (`upload-*.ps1`) | Archivo PHP subido | Que hace al abrirlo en el navegador |
|---|---|---|
| `upload-migrate-script.ps1` | `migrate_tmp.php` | Corre `php artisan migrate --force` en el servidor y muestra la salida. |
| `upload-check-script.ps1` | `check_migrations_table.php` | Muestra el estado de la base de datos real: conexion activa, que migraciones de las nuevas ya corrieron, columnas de `users`, si existe la tabla `settings`, y el listado de vehiculos cargados. Es de solo lectura. |
| `upload-reset-script.ps1` | `reset_db_tmp.php` | Corre `php artisan migrate:fresh --force`, es decir **borra y recrea todas las tablas** de la base de datos de produccion. Usar con mucho cuidado: destruye los datos reales. |
| `upload-seed-script.ps1` | `seed_admin_tmp.php` | Recrea el usuario administrador si no existe (util despues de un `migrate:fresh`). |

Cada archivo PHP de este grupo esta protegido por una clave fija en la URL (por ejemplo `https://bigonerentacar.online/nombre_del_script.php?key=...`). La clave real esta escrita dentro de cada archivo `*_tmp.php` / `check_migrations_table.php` en esta maquina; no se reproduce en este README para no exponerla en el historial de git.

Flujo de uso: primero correr el `upload-*.ps1` correspondiente (sube el `.php` a `/public_html`), despues abrir la URL con la clave en el navegador para ejecutarlo, y **por ultimo borrar el archivo `.php` del servidor** (por FTP o desde el administrador de archivos de cPanel) para que nadie mas pueda volver a ejecutarlo. Estos archivos son para emergencias puntuales, no para el flujo normal de despliegue.

## Notas de seguridad

Por decision de este repositorio NO se incluyen:

- Los archivos `.env` y `.env.production` (contienen claves y configuracion).
- La base de datos `database/database.sqlite` (datos reales).
- Los archivos subidos por clientes en `storage/app` (documentos personales).
- Los scripts `*.ps1` de la raiz y los archivos `*_tmp.php` / `check_migrations_table.php` (contienen credenciales FTP, rutas del servidor y la clave de acceso de los scripts de emergencia descritos en "Despliegue a produccion").

La clave `LIBELULA_APPKEY` del frontend es una llave de la pasarela de pago que se usa del lado del cliente (ya viaja en el bundle publico del sitio). Tenerla presente al revisar el codigo.

El seeder `backend/database/seeders/DatabaseSeeder.php` (si, esta tracked por git) crea un usuario administrador con una contrasena fija pensada solo para desarrollo local. Si este proyecto llegara a usarse en un entorno real, cambiar esa contrasena (o quitar el seeder) antes de desplegar.
