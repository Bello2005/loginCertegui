# Backend - Sistema de Citas Médicas

Backend Node.js/Express para el sistema de citas médicas.

## 📋 Instalación

```bash
npm install
```

## 🚀 Ejecución

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del backend:

```env
PORT=3000
NODE_ENV=development
```

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

## 📡 Endpoints

### POST /login
Autentica un usuario y devuelve un token y datos del usuario.

**Request:**
```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "token_1_1234567890",
  "user": {
    "id": 1,
    "nombre": "Administrador",
    "apellido": "Sistema",
    "correo": "admin@gmail.com",
    "rol": {
      "nombre": "admin"
    }
  }
}
```

### POST /register
Registra un nuevo usuario (rol: paciente por defecto).

**Request:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 4,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    "rol": {
      "nombre": "paciente"
    }
  }
}
```

### GET /health
Endpoint de salud del servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🌐 Despliegue

### Opciones de Despliegue

1. **Railway** - Recomendado para inicio rápido
   - Conecta tu repositorio
   - Selecciona el directorio `backend`
   - Railway detectará Node.js automáticamente

2. **Render** - Alternativa gratuita
   - Crea un nuevo Web Service
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Heroku**
   ```bash
   heroku create tu-app-backend
   git subtree push --prefix backend heroku main
   ```

4. **VPS/Servidor Propio**
   - Usa PM2 para gestión de procesos
   ```bash
   npm install -g pm2
   pm2 start server.js --name "certegui-backend"
   pm2 save
   ```

### Configuración CORS para Producción

Asegúrate de actualizar la configuración CORS en `server.js` con las URLs de tu frontend:

```javascript
app.use(cors({
  origin: [
    'https://tu-frontend.vercel.app',
    'https://tu-frontend.netlify.app',
    'http://localhost:5173' // Para desarrollo local
  ],
  credentials: true
}));
```

## 📝 Notas

- Los datos actualmente están en memoria (usuarios de prueba)
- Para producción, implementa una base de datos (PostgreSQL, MongoDB, etc.)
- El sistema está listo para escalar con una base de datos real

## 🔗 Ver También

- [README Principal](../README.md) - Guía completa del proyecto

