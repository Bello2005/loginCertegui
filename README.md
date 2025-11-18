# 🦷 Ortho&Mas - Sistema de Gestión de Citas Odontológicas

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

**Sistema completo de gestión de citas médicas con autenticación basada en roles**

[Características](#-características-principales) • [Instalación](#-instalación-rápida) • [Documentación](#-documentación-completa) • [Despliegue](#-despliegue)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Instalación Rápida](#-instalación-rápida)
- [Instalación Detallada](#-instalación-detallada-paso-a-paso)
- [Configuración Inicial](#-configuración-inicial)
- [Ejecución del Proyecto](#-ejecución-del-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [Scripts Disponibles](#-scripts-disponibles)
- [Despliegue](#-despliegue)
- [Solución de Problemas](#-solución-de-problemas)
- [Base de Datos](#-base-de-datos)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 📖 Descripción

**Ortho&Mas** es un sistema completo de gestión de citas odontológicas diseñado para facilitar la administración de consultorios dentales. El sistema permite gestionar pacientes, doctores, citas, tratamientos, inventario y más, con una interfaz moderna y fácil de usar.

El sistema está dividido en tres roles principales:
- **👨‍💼 Administrador**: Control total del sistema, estadísticas, gestión de usuarios y recursos
- **👨‍⚕️ Doctor**: Gestión de citas, horarios, notas médicas y visualización de tratamientos
- **👤 Paciente**: Agendar citas, ver historial, consultar servicios y gestionar perfil

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- ✅ Sistema de autenticación basado en roles (Admin, Doctor, Paciente)
- ✅ Rutas protegidas con verificación de permisos
- ✅ Validación de formularios en tiempo real
- ✅ Manejo seguro de sesiones

### 📅 Gestión de Citas
- ✅ Agendar, reprogramar y cancelar citas
- ✅ Calendario interactivo con vista mensual/semanal
- ✅ Búsqueda de horarios disponibles
- ✅ Historial completo de citas
- ✅ Estados de citas (Programada, Completada, Cancelada, Pendiente)

### 📊 Dashboards Especializados
- ✅ **Dashboard Admin**: Estadísticas, gráficos, gestión completa del sistema
- ✅ **Dashboard Doctor**: Citas del día, horarios, notas médicas
- ✅ **Dashboard Paciente**: Próxima cita, agendar nueva, historial

### 🎨 Interfaz de Usuario
- ✅ Diseño moderno con animaciones (Framer Motion)
- ✅ Modo oscuro/claro
- ✅ Diseño completamente responsive
- ✅ Validación visual en tiempo real
- ✅ Feedback inmediato con toasts

### 🗄️ Gestión de Datos
- ✅ CRUD completo para todas las entidades
- ✅ Paginación en todas las tablas
- ✅ Filtrado y búsqueda avanzada
- ✅ Base de datos SQLite con datos de prueba

### 📈 Estadísticas y Reportes
- ✅ Gráficos de citas por día (barras)
- ✅ Distribución de estados de citas (pastel)
- ✅ Métricas con comparación mensual
- ✅ Tasa de confirmación y pacientes nuevos

---

## 🛠 Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.0 | Biblioteca de UI |
| **Vite** | 7.2.2 | Build tool y dev server |
| **React Router** | 7.9.5 | Enrutamiento SPA |
| **Tailwind CSS** | 3.4.18 | Framework CSS utility-first |
| **Framer Motion** | 12.23.24 | Animaciones y transiciones |
| **Axios** | 1.13.2 | Cliente HTTP |
| **Recharts** | 3.4.1 | Gráficos y visualizaciones |
| **React Big Calendar** | 1.19.4 | Calendario interactivo |
| **Day.js** | 1.11.19 | Manejo de fechas |
| **Lucide React** | 0.553.0 | Iconos modernos |
| **React Toastify** | 11.0.5 | Notificaciones |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | >=18.0.0 | Runtime de JavaScript |
| **Express** | 4.18.2 | Framework web |
| **better-sqlite3** | 11.7.0 | Base de datos SQLite |
| **CORS** | 2.8.5 | Manejo de CORS |
| **dotenv** | 16.3.1 | Variables de entorno |

---

## 💻 Requisitos del Sistema

### Requisitos Mínimos
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 (o yarn/pnpm)
- **Git**: Para clonar el repositorio
- **Sistema Operativo**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)

### Requisitos Recomendados
- **RAM**: 4GB mínimo, 8GB recomendado
- **Espacio en disco**: 500MB libres
- **Navegador**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Verificar Instalación
```bash
# Verificar Node.js
node --version  # Debe mostrar >= 18.0.0

# Verificar npm
npm --version   # Debe mostrar >= 9.0.0

# Verificar Git
git --version
```

---

## 🚀 Instalación Rápida

Para usuarios experimentados que quieren empezar rápido:

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd Certegui

# 2. Instalar dependencias del backend
cd backend && npm install && cd ..

# 3. Instalar dependencias del frontend
cd frontend && npm install && cd ..

# 4. Iniciar backend (terminal 1)
cd backend && npm run dev

# 5. Iniciar frontend (terminal 2)
cd frontend && npm run dev

# 6. Abrir http://localhost:5173 en el navegador
```

---

## 📝 Instalación Detallada (Paso a Paso)

### Paso 1: Clonar el Repositorio

```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Navegar al directorio del proyecto
cd Certegui
```

### Paso 2: Instalar Dependencias del Backend

```bash
# Navegar al directorio backend
cd backend

# Instalar todas las dependencias
npm install

# Verificar que se instalaron correctamente
npm list --depth=0
```

**Dependencias que se instalarán:**
- `express`: Framework web para Node.js
- `cors`: Middleware para habilitar CORS
- `dotenv`: Carga variables de entorno
- `better-sqlite3`: Driver para SQLite

### Paso 3: Instalar Dependencias del Frontend

```bash
# Volver a la raíz del proyecto
cd ..

# Navegar al directorio frontend
cd frontend

# Instalar todas las dependencias
npm install

# Verificar que se instalaron correctamente
npm list --depth=0
```

**Nota:** La instalación puede tardar varios minutos dependiendo de tu conexión a internet.

### Paso 4: Verificar la Estructura

Asegúrate de que tu estructura de directorios se vea así:

```
Certegui/
├── backend/
│   ├── node_modules/      ✅ Debe existir
│   ├── package.json
│   ├── server.js
│   ├── database.js
│   └── .gitignore
├── frontend/
│   ├── node_modules/      ✅ Debe existir
│   ├── package.json
│   ├── src/
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Configuración Inicial

### Configuración del Backend

El backend no requiere configuración adicional para desarrollo. La base de datos SQLite se crea automáticamente al iniciar el servidor.

**Opcional:** Crear archivo `.env` en `backend/`:

```env
PORT=3000
NODE_ENV=development
```

### Configuración del Frontend

El frontend está configurado para conectarse a `http://localhost:3000` por defecto.

**Para producción:** Crear archivo `.env` en `frontend/`:

```env
VITE_API_URL=https://tu-backend.com
```

---

## ▶️ Ejecución del Proyecto

### Desarrollo Local

#### Terminal 1: Iniciar Backend

```bash
cd backend
npm run dev
```

**Salida esperada:**
```
✅ Base de datos inicializada correctamente
📊 Datos de prueba insertados en todas las tablas
🚀 Servidor corriendo en http://localhost:3000
```

#### Terminal 2: Iniciar Frontend

```bash
cd frontend
npm run dev
```

**Salida esperada:**
```
  VITE v7.2.2  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Acceder a la Aplicación

1. Abre tu navegador en `http://localhost:5173`
2. Usa las [credenciales de prueba](#-credenciales-de-prueba) para iniciar sesión
3. Explora los diferentes dashboards según el rol

### Verificar que Todo Funciona

1. **Backend funcionando:**
   - Visita `http://localhost:3000/health` en tu navegador
   - Deberías ver: `{"status":"ok","timestamp":"..."}`

2. **Frontend funcionando:**
   - Deberías ver la página de login en `http://localhost:5173`
   - No deberías ver errores en la consola del navegador

---

## 📁 Estructura del Proyecto

```
Certegui/
├── backend/                          # Servidor Node.js/Express
│   ├── server.js                    # Servidor principal
│   ├── database.js                  # Configuración de base de datos
│   ├── database.sqlite              # Base de datos SQLite (se crea automáticamente)
│   ├── package.json                  # Dependencias del backend
│   ├── .gitignore                    # Archivos ignorados por Git
│   └── README.md                     # Documentación del backend
│
├── frontend/                         # Aplicación React
│   ├── src/
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── CitaModal.jsx        # Modal de detalles de cita
│   │   │   ├── PerfilModal.jsx      # Modal de edición de perfil
│   │   │   ├── ProtectedRoute.jsx   # Componente de rutas protegidas
│   │   │   └── DarkModeToggle.jsx   # Toggle de modo oscuro
│   │   │
│   │   ├── pages/                   # Páginas de la aplicación
│   │   │   ├── LoginPage.jsx        # Página de inicio de sesión
│   │   │   ├── RegisterPage.jsx     # Página de registro
│   │   │   │
│   │   │   ├── dashboardAdmin/      # Dashboard de administrador
│   │   │   │   ├── DashboardAdmin.jsx
│   │   │   │   ├── CalendarioCitas.jsx
│   │   │   │   ├── PacientesDashboard.jsx
│   │   │   │   ├── DoctorDashboard.jsx
│   │   │   │   ├── TratamientosDashboard.jsx
│   │   │   │   └── ... (15+ dashboards)
│   │   │   │
│   │   │   ├── dashboardMedico/     # Dashboard de doctor
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── NotasView.jsx
│   │   │   │   ├── HorariosView.jsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── dashboardCliente/    # Dashboard de paciente
│   │   │       ├── DashboardCliente.jsx
│   │   │       ├── ProximaCita.jsx
│   │   │       ├── NuevaCita/
│   │   │       └── ...
│   │   │
│   │   ├── services/                # Servicios y utilidades
│   │   │   └── api.js               # Configuración de Axios
│   │   │
│   │   ├── context/                 # Contextos de React
│   │   │   └── AuthContext.jsx      # Contexto de autenticación
│   │   │
│   │   ├── App.jsx                  # Componente raíz
│   │   ├── Rutas.jsx                # Configuración de rutas
│   │   ├── main.jsx                 # Punto de entrada
│   │   └── index.css                # Estilos globales (Tailwind)
│   │
│   ├── public/                      # Archivos estáticos
│   ├── index.html                   # HTML principal
│   ├── package.json                 # Dependencias del frontend
│   ├── vite.config.js               # Configuración de Vite
│   ├── tailwind.config.js           # Configuración de Tailwind
│   ├── postcss.config.js            # Configuración de PostCSS
│   └── README.md                    # Documentación del frontend
│
└── README.md                        # Este archivo
```

---

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/login` | Iniciar sesión | No |
| `POST` | `/register` | Registrar nuevo usuario | No |
| `GET` | `/api/usuario/me` | Obtener usuario actual | Sí |
| `PUT` | `/api/usuario/me` | Actualizar perfil | Sí |

### Citas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/citas` | Listar todas las citas (con filtros) |
| `GET` | `/api/citas/:id` | Obtener cita por ID |
| `GET` | `/api/citas/proximas` | Próximas citas (admin) |
| `GET` | `/api/citas/proxima` | Próxima cita del paciente |
| `GET` | `/api/citas/historial` | Historial de citas del paciente |
| `GET` | `/api/citas/calendario` | Citas para calendario |
| `GET` | `/api/citas/doctor/:doctorId` | Citas de un doctor |
| `GET` | `/api/citas/horas-disponibles` | Horas disponibles de un doctor |
| `POST` | `/api/citas` | Crear nueva cita |
| `PUT` | `/api/citas/:id/estado` | Actualizar estado de cita |
| `DELETE` | `/api/citas/:id` | Eliminar cita |

### Pacientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/pacientes` | Listar pacientes (paginado) |
| `POST` | `/api/pacientes` | Crear nuevo paciente |

### Doctores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/doctores` | Listar doctores (paginado) |
| `GET` | `/api/doctores/especialistas` | Listar doctores con especialidades |
| `GET` | `/api/doctores/me` | Obtener doctor_id desde usuario_id |
| `POST` | `/api/doctores` | Crear nuevo doctor |
| `PUT` | `/api/doctores/:id` | Actualizar doctor |
| `DELETE` | `/api/doctores/:id` | Eliminar doctor |

### Administración

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/admin/estadisticas` | Estadísticas del dashboard |
| `GET` | `/api/admin/citas-por-dia` | Citas por día de la semana |
| `GET` | `/api/admin/estado-citas` | Distribución de estados de citas |

### Otros Endpoints

Todos los recursos (tratamientos, procedimientos, materiales, equipos, proveedores, inventario, servicios, especialidades, horarios, notas) tienen endpoints CRUD estándar:

- `GET /api/{recurso}` - Listar (con paginación)
- `POST /api/{recurso}` - Crear
- `PUT /api/{recurso}/:id` - Actualizar
- `DELETE /api/{recurso}/:id` - Eliminar

**Nota:** Todos los endpoints de `/api/*` requieren autenticación (excepto login y register).

---

## 🔑 Credenciales de Prueba

El sistema viene con usuarios de prueba pre-configurados:

### 👨‍💼 Administrador
```
Email: admin@gmail.com
Password: 123456
Redirección: /admin
```

**Permisos:**
- Acceso completo al sistema
- Gestión de usuarios, doctores y pacientes
- Estadísticas y reportes
- Configuración del sistema

### 👨‍⚕️ Doctor
```
Email: doctor@gmail.com
Password: 123456
Redirección: /medico
```

**Permisos:**
- Ver y gestionar sus propias citas
- Gestionar horarios
- Crear y editar notas médicas
- Ver tratamientos y procedimientos

### 👤 Paciente
```
Email: paciente@gmail.com
Password: 123456
Redirección: /cliente
```

**Permisos:**
- Agendar nuevas citas
- Ver próxima cita
- Ver historial de citas
- Gestionar perfil personal
- Ver servicios, tratamientos y especialidades

---

## 📜 Scripts Disponibles

### Backend

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

### Frontend

```bash
# Desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview

# Linter
npm run lint
```

---

## 🌐 Despliegue

### Opción 1: Vercel (Frontend) + Railway (Backend)

#### Frontend en Vercel

1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Configura:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Variables de entorno:
   - `VITE_API_URL`: URL de tu backend

#### Backend en Railway

1. Conecta tu repositorio en [railway.app](https://railway.app)
2. Selecciona directorio `backend`
3. Railway detectará Node.js automáticamente
4. Variables de entorno:
   - `NODE_ENV`: production
   - `PORT`: (asignado automáticamente)

### Opción 2: Netlify (Frontend) + Render (Backend)

#### Frontend en Netlify

1. Conecta tu repositorio en [netlify.com](https://netlify.com)
2. Configura:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

#### Backend en Render

1. Crea un nuevo Web Service en [render.com](https://render.com)
2. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Opción 3: Servidor Propio (VPS)

Ver guía completa en la sección de despliegue del README original.

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"

**Solución:**
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: Puerto 3000 o 5173 en uso

**Solución:**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: Base de datos no se crea

**Solución:**
```bash
# Verificar permisos de escritura
cd backend
ls -la database.sqlite

# Si no existe, el servidor la creará automáticamente
npm run dev
```

### Error: CORS en producción

**Solución:** Actualizar CORS en `backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://tu-frontend.com', 'http://localhost:5173'],
  credentials: true
}));
```

### Error: Rutas no funcionan en producción

**Solución:** Configurar redirección en servidor web (Nginx/Apache):
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Error: Dependencias faltantes

**Solución:**
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### Error: Vite optimization

**Solución:**
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

---

## 🗄️ Base de Datos

### SQLite

El proyecto utiliza **SQLite** con `better-sqlite3` como driver. La base de datos se crea automáticamente al iniciar el servidor.

### Estructura de Tablas

- `roles` - Roles del sistema (admin, doctor, paciente)
- `usuarios` - Usuarios del sistema
- `doctores` - Información de doctores
- `citas` - Citas médicas
- `tratamientos` - Tratamientos disponibles
- `procedimientos` - Procedimientos médicos
- `materiales` - Materiales del consultorio
- `equipos` - Equipos médicos
- `proveedores` - Proveedores
- `inventario` - Inventario
- `servicios` - Servicios ofrecidos
- `especialidades` - Especialidades médicas
- `horarios` - Horarios de doctores
- `notas` - Notas médicas

### Datos de Prueba

La base de datos se inicializa automáticamente con:
- 3 usuarios de prueba (admin, doctor, paciente)
- Múltiples doctores, pacientes y citas
- Datos de ejemplo para todas las tablas

### Backup de Base de Datos

```bash
# Copiar base de datos
cp backend/database.sqlite backend/database.sqlite.backup

# Restaurar
cp backend/database.sqlite.backup backend/database.sqlite
```

---

## 🤝 Contribución

Este es un proyecto privado. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es **privado** y de uso interno. Todos los derechos reservados.

---

## 📞 Soporte

¿Necesitas ayuda?

- 📧 Email: [tu-email@ejemplo.com]
- 🐛 Issues: [GitHub Issues]
- 📖 Documentación: Este README

---

## 🎯 Estado del Proyecto

✅ **Completado:**
- Sistema de autenticación
- Dashboards por rol
- CRUD completo
- Base de datos funcional
- UI/UX moderna
- Modo oscuro
- Paginación
- Estadísticas

🔄 **En desarrollo:**
- Mejoras de rendimiento
- Nuevas funcionalidades según feedback

---

<div align="center">

**Desarrollado con ❤️ para Ortho&Mas**

⭐ Si te gusta este proyecto, dale una estrella en GitHub

</div>
