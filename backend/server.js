import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Credenciales de prueba
const usuariosPrueba = [
  {
    id: 1,
    nombre: 'Administrador',
    apellido: 'Sistema',
    correo: 'admin@gmail.com',
    password: '123456',
    rol: {
      id: 1,
      nombre: 'admin'
    }
  },
  {
    id: 2,
    nombre: 'Dr. Juan',
    apellido: 'Pérez',
    correo: 'doctor@gmail.com',
    password: '123456',
    rol: {
      id: 2,
      nombre: 'doctor'
    }
  },
  {
    id: 3,
    nombre: 'María',
    apellido: 'González',
    correo: 'paciente@gmail.com',
    password: '123456',
    rol: {
      id: 3,
      nombre: 'paciente'
    }
  }
];

// Endpoint de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Datos incompletos'
    });
  }

  // Buscar usuario por correo y contraseña
  const usuario = usuariosPrueba.find(
    u => u.correo === email && u.password === password
  );

  if (!usuario) {
    return res.status(401).json({
      message: 'Credenciales incorrectas'
    });
  }

  // Generar token simple (en producción usar JWT)
  const token = `token_${usuario.id}_${Date.now()}`;

  // Preparar respuesta según lo que espera el frontend
  const response = {
    token: token,
    user: {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: {
        nombre: usuario.rol.nombre
      }
    }
  };

  res.json(response);
});

// Endpoint de registro
app.post('/register', (req, res) => {
  const { nombre, apellido, correo, password } = req.body;

  // Validación de campos
  if (!nombre || !apellido || !correo || !password) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos'
    });
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de correo inválido'
    });
  }

  // Validación de longitud de contraseña
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña debe tener al menos 6 caracteres'
    });
  }

  // Verificar si el correo ya existe
  const usuarioExistente = usuariosPrueba.find(u => u.correo === correo);
  if (usuarioExistente) {
    return res.status(409).json({
      success: false,
      message: 'Este correo ya está registrado'
    });
  }

  // Crear nuevo usuario (por defecto como paciente)
  const nuevoUsuario = {
    id: usuariosPrueba.length + 1,
    nombre,
    apellido,
    correo,
    password, // En producción, esto debería estar hasheado
    rol: {
      id: 3,
      nombre: 'paciente'
    }
  };

  usuariosPrueba.push(nuevoUsuario);

  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    user: {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
      correo: nuevoUsuario.correo,
      rol: {
        nombre: nuevoUsuario.rol.nombre
      }
    }
  });
});

// Endpoint de prueba
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Credenciales de prueba:`);
  console.log(`   Admin: admin@gmail.com / 123456`);
  console.log(`   Doctor: doctor@gmail.com / 123456`);
  console.log(`   Paciente: paciente@gmail.com / 123456`);
});

