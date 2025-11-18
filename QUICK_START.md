# ⚡ Inicio Rápido - Ortho&Mas

Guía rápida para empezar en menos de 5 minutos.

## ✅ Checklist Pre-Instalación

Antes de comenzar, verifica que tengas:

- [ ] Node.js >= 18.0.0 instalado (`node --version`)
- [ ] npm >= 9.0.0 instalado (`npm --version`)
- [ ] Git instalado (`git --version`)
- [ ] Conexión a internet (para descargar dependencias)

## 🚀 Pasos Rápidos

### 1. Clonar y Navegar
```bash
git clone <url-del-repositorio>
cd Certegui
```

### 2. Instalar Backend
```bash
cd backend
npm install
cd ..
```

### 3. Instalar Frontend
```bash
cd frontend
npm install
cd ..
```

### 4. Iniciar Backend (Terminal 1)
```bash
cd backend
npm run dev
```

**Espera a ver:** `🚀 Servidor corriendo en http://localhost:3000`

### 5. Iniciar Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

**Espera a ver:** `Local: http://localhost:5173/`

### 6. Abrir en Navegador
Abre: `http://localhost:5173`

### 7. Iniciar Sesión
Usa estas credenciales:

**Admin:**
- Email: `admin@gmail.com`
- Password: `123456`

**Doctor:**
- Email: `doctor@gmail.com`
- Password: `123456`

**Paciente:**
- Email: `paciente@gmail.com`
- Password: `123456`

## ⚠️ Problemas Comunes

### "npm: command not found"
**Solución:** Instala Node.js desde [nodejs.org](https://nodejs.org)

### "Port 3000 already in use"
**Solución:**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Cannot find module"
**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### La base de datos no se crea
**Solución:** El servidor la crea automáticamente. Solo espera a que inicie.

## 📚 Documentación Completa

Para más detalles, consulta el [README.md](./README.md) principal.

## 🆘 ¿Necesitas Ayuda?

1. Revisa la sección de [Solución de Problemas](./README.md#-solución-de-problemas) en el README
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que ambos servidores estén corriendo

---

**¡Listo!** Ya deberías tener el sistema funcionando. 🎉

