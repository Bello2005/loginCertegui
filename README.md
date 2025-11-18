# 🦷 Ortho&Mas - Sistema de Gestión de Citas Odontológicas

Sistema completo de gestión de citas médicas con autenticación basada en roles (Administrador, Doctor, Paciente). Desarrollado con React (Frontend) y Node.js/Express (Backend).

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Desarrollo Local](#-desarrollo-local)
- [Construcción para Producción](#-construcción-para-producción)
- [Despliegue](#-despliegue)
  - [Opción 1: Despliegue en Vercel (Frontend) + Railway/Render (Backend)](#opción-1-despliegue-en-vercel-frontend--railwayrender-backend)
  - [Opción 2: Despliegue en Netlify (Frontend) + Heroku (Backend)](#opción-2-despliegue-en-netlify-frontend--heroku-backend)
  - [Opción 3: Despliegue en Servidor Propio (VPS)](#opción-3-despliegue-en-servidor-propio-vps)
  - [Opción 4: Despliegue con Docker](#opción-4-despliegue-con-docker)
- [Variables de Entorno](#-variables-de-entorno)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Solución de Problemas](#-solución-de-problemas)

## ✨ Características

- 🔐 Autenticación basada en roles (Admin, Doctor, Paciente)
- 📅 Gestión de citas médicas
- 👥 Dashboard para cada tipo de usuario
- 📊 Estadísticas y gráficos
- 🎨 Interfaz moderna con animaciones (Framer Motion)
- 🌙 Modo oscuro
- 📱 Diseño responsive
- ⚡ Desarrollo rápido con Vite

## 🛠 Tecnologías

### Frontend
- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Framer Motion** - Animaciones
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos
- **Moment.js** - Manejo de fechas
- **Day.js** - Manejo de fechas alternativo

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **CORS** - Manejo de CORS
- **dotenv** - Variables de entorno

## 📦 Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x (o **yarn** / **pnpm**)
- **Git** (para clonar el repositorio)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Certegui
```

2. **Instalar dependencias del Backend**
```bash
cd backend
npm install
```

3. **Instalar dependencias del Frontend**
```bash
cd ../frontend
npm install
```

## 💻 Desarrollo Local

### Iniciar el Backend

```bash
cd backend
npm run dev
```

El servidor backend estará disponible en `http://localhost:3000`

### Iniciar el Frontend

En una nueva terminal:

```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### Acceder a la aplicación

Abre tu navegador en `http://localhost:5173` y usa las [credenciales de prueba](#-credenciales-de-prueba).

## 🏗 Construcción para Producción

### Backend

El backend no requiere build, solo asegúrate de tener todas las dependencias instaladas:

```bash
cd backend
npm install --production
```

### Frontend

```bash
cd frontend
npm run build
```

Esto generará una carpeta `dist/` con los archivos optimizados para producción.

Para previsualizar el build:

```bash
npm run preview
```

## 🌐 Despliegue

### Opción 1: Despliegue en Vercel (Frontend) + Railway/Render (Backend)

#### Frontend en Vercel

1. **Instalar Vercel CLI** (opcional)
```bash
npm i -g vercel
```

2. **Desplegar desde el directorio frontend**
```bash
cd frontend
vercel
```

O conecta tu repositorio en [vercel.com](https://vercel.com) y configura:
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

3. **Configurar variables de entorno en Vercel**
   - `VITE_API_URL`: URL de tu backend desplegado (ej: `https://tu-backend.railway.app`)

#### Backend en Railway

1. **Crear cuenta en [Railway](https://railway.app)**

2. **Nuevo proyecto desde GitHub**
   - Conecta tu repositorio
   - Selecciona el directorio `backend`

3. **Configurar variables de entorno**
   - `PORT`: 3000 (o el puerto que Railway asigne)
   - `NODE_ENV`: production

4. **Railway detectará automáticamente Node.js y ejecutará `npm start`**

#### Backend en Render

1. **Crear cuenta en [Render](https://render.com)**

2. **Nuevo Web Service**
   - Conecta tu repositorio
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

3. **Configurar variables de entorno**
   - `NODE_ENV`: production
   - `PORT`: (Render lo asigna automáticamente)

4. **Actualizar CORS en `backend/server.js`**
```javascript
app.use(cors({
  origin: ['https://tu-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

---

### Opción 2: Despliegue en Netlify (Frontend) + Heroku (Backend)

#### Frontend en Netlify

1. **Crear cuenta en [Netlify](https://netlify.com)**

2. **Nuevo sitio desde Git**
   - Conecta tu repositorio
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

3. **Configurar variables de entorno**
   - `VITE_API_URL`: URL de tu backend

4. **Crear archivo `netlify.toml` en `frontend/`**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Backend en Heroku

1. **Instalar Heroku CLI**
```bash
npm install -g heroku
```

2. **Login en Heroku**
```bash
heroku login
```

3. **Crear aplicación**
```bash
cd backend
heroku create tu-app-backend
```

4. **Configurar variables de entorno**
```bash
heroku config:set NODE_ENV=production
```

5. **Desplegar**
```bash
git subtree push --prefix backend heroku main
```

O conecta tu repositorio desde el dashboard de Heroku.

6. **Actualizar CORS en `backend/server.js`**
```javascript
app.use(cors({
  origin: ['https://tu-frontend.netlify.app', 'http://localhost:5173'],
  credentials: true
}));
```

---

### Opción 3: Despliegue en Servidor Propio (VPS)

#### Requisitos del servidor
- Ubuntu 20.04+ o similar
- Node.js 18+ instalado
- Nginx (opcional, para reverse proxy)
- PM2 para gestión de procesos

#### Pasos de despliegue

1. **Conectar al servidor**
```bash
ssh usuario@tu-servidor.com
```

2. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Certegui
```

3. **Configurar Backend**

```bash
cd backend
npm install --production
```

Crear archivo `.env`:
```env
PORT=3000
NODE_ENV=production
```

Instalar PM2:
```bash
npm install -g pm2
```

Iniciar backend con PM2:
```bash
pm2 start server.js --name "certegui-backend"
pm2 save
pm2 startup
```

4. **Configurar Frontend**

```bash
cd ../frontend
npm install
npm run build
```

5. **Configurar Nginx (Recomendado)**

Crear archivo `/etc/nginx/sites-available/certegui`:
```nginx
# Backend API
server {
    listen 80;
    server_name api.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name tu-dominio.com;

    root /ruta/a/Certegui/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Habilitar sitio:
```bash
sudo ln -s /etc/nginx/sites-available/certegui /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

6. **Configurar SSL con Let's Encrypt (Opcional pero recomendado)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d api.tu-dominio.com
```

---

### Opción 4: Despliegue con Docker

#### Crear Dockerfile para Backend

Crear `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Crear Dockerfile para Frontend

Crear `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Crear docker-compose.yml (raíz del proyecto)

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

#### Desplegar con Docker

```bash
docker-compose up -d
```

Para actualizar:
```bash
docker-compose down
docker-compose up -d --build
```

---

## 🔧 Variables de Entorno

### Backend (.env)

```env
PORT=3000
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

Para producción, actualiza `VITE_API_URL` con la URL de tu backend desplegado.

---

## 🔑 Credenciales de Prueba

### Administrador
- **Email:** admin@gmail.com
- **Password:** 123456
- **Redirección:** `/admin`

### Doctor
- **Email:** doctor@gmail.com
- **Password:** 123456
- **Redirección:** `/medico`

### Paciente
- **Email:** paciente@gmail.com
- **Password:** 123456
- **Redirección:** `/cliente`

---

## 📁 Estructura del Proyecto

```
Certegui/
├── backend/
│   ├── server.js          # Servidor Express
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── pages/         # Componentes de páginas
│   │   │   ├── dashboardAdmin/
│   │   │   ├── dashboardMedico/
│   │   │   ├── dashboardCliente/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/      # Servicios API
│   │   ├── context/       # Contextos React
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 📜 Scripts Disponibles

### Backend
- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con auto-reload

### Frontend
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter

---

## 🐛 Solución de Problemas

### Error: "vite" no se reconoce como comando interno
**Solución:** Usa `npx vite` o `npm run dev` en lugar de ejecutar `vite` directamente.

```bash
# ❌ Incorrecto
vite

# ✅ Correcto
npm run dev
# o
npx vite
```

### Error: Dependencias faltantes (moment, etc.)
Si ves errores como "The following dependencies are imported but could not be resolved", ejecuta:

```bash
cd frontend
npm install
```

Esto instalará todas las dependencias faltantes, incluyendo `moment` que es requerido por `react-big-calendar`.

### Error: Puerto en uso
```bash
# Linux/Mac
fuser -k 3000/tcp
# o
killall node

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: Módulos no encontrados
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error CORS en producción
Asegúrate de actualizar la configuración CORS en `backend/server.js` con las URLs correctas de tu frontend desplegado.

### Error 404 en rutas del frontend
Configura tu servidor web (Nginx, Apache, etc.) para redirigir todas las rutas a `index.html` (SPA routing).

### Error: Failed to run dependency scan
Si ves este error al iniciar el servidor de desarrollo, asegúrate de que todas las dependencias estén instaladas:

```bash
cd frontend
npm install
```

Si el problema persiste, elimina `node_modules` y `package-lock.json` y reinstala:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Optimización de esbuild
Si ves errores relacionados con esbuild durante el build o desarrollo:

1. **Limpiar caché de Vite:**
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

2. **Si el problema persiste, reinstalar dependencias:**
```bash
cd frontend
rm -rf node_modules package-lock.json node_modules/.vite
npm install
npm run dev
```

3. **Para problemas de memoria con esbuild (builds grandes):**
```bash
# Aumentar memoria de Node.js (si es necesario)
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

La configuración de Vite ya está optimizada para manejar dependencias grandes como `moment` y `react-big-calendar`.

---

## 📝 Notas Adicionales

- El backend actualmente usa datos de prueba en memoria. Para producción, deberás implementar una base de datos (PostgreSQL, MongoDB, etc.).
- Algunos endpoints del frontend están comentados con `TODO` para futura implementación en el backend.
- El sistema está optimizado para desarrollo y producción.

---

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

## 👥 Contribuidores

- Equipo de desarrollo Ortho&Mas

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo.

