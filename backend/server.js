import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ==================== AUTENTICACIÓN ====================

// Endpoint de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Datos incompletos'
    });
  }

  try {
    const usuario = db.prepare(`
      SELECT u.*, r.nombre as rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.correo = ? AND u.password = ?
    `).get(email, password);

    if (!usuario) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    const token = `token_${usuario.id}_${Date.now()}`;

    res.json({
      token: token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: {
          nombre: usuario.rol_nombre
        }
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener información del usuario actual
app.get('/api/usuario/me', (req, res) => {
  try {
    const { usuario_id } = req.query;
    
    if (!usuario_id) {
      return res.status(400).json({ message: 'usuario_id requerido' });
    }

    const usuarioId = parseInt(usuario_id);
    if (isNaN(usuarioId)) {
      return res.status(400).json({ message: 'usuario_id inválido' });
    }

    console.log(`[API] Buscando usuario con ID: ${usuarioId}`);

    const usuario = db.prepare(`
      SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.correo,
        r.id as rol_id,
        r.nombre as rol_nombre
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `).get(usuarioId);

    if (!usuario) {
      console.log(`[API] Usuario con ID ${usuarioId} no encontrado`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log(`[API] Usuario ${usuarioId} encontrado: ${usuario.nombre} ${usuario.apellido}`);

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: {
        id: usuario.rol_id,
        nombre: usuario.rol_nombre || 'sin rol'
      }
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Actualizar información del usuario
app.put('/api/usuario/me', (req, res) => {
  try {
    const { usuario_id, nombre, apellido, correo, password } = req.body;
    
    if (!usuario_id) {
      return res.status(400).json({ message: 'usuario_id requerido' });
    }

    // Verificar que el usuario existe
    const usuarioExistente = db.prepare('SELECT id FROM usuarios WHERE id = ?').get(usuario_id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Construir la consulta dinámicamente según los campos proporcionados
    const updates = [];
    const values = [];

    if (nombre) {
      updates.push('nombre = ?');
      values.push(nombre);
    }
    if (apellido) {
      updates.push('apellido = ?');
      values.push(apellido);
    }
    if (correo) {
      // Verificar que el correo no esté en uso por otro usuario
      const correoExistente = db.prepare('SELECT id FROM usuarios WHERE correo = ? AND id != ?').get(correo, usuario_id);
      if (correoExistente) {
        return res.status(400).json({ message: 'El correo ya está en uso' });
      }
      updates.push('correo = ?');
      values.push(correo);
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
      }
      updates.push('password = ?');
      values.push(password);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    values.push(usuario_id);
    const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`;
    
    db.prepare(query).run(...values);

    // Obtener el usuario actualizado
    const usuario = db.prepare(`
      SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.correo,
        r.id as rol_id,
        r.nombre as rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `).get(usuario_id);

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: {
          id: usuario.rol_id,
          nombre: usuario.rol_nombre
        }
      }
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Endpoint de registro
app.post('/register', (req, res) => {
  const { nombre, apellido, correo, password } = req.body;

  if (!nombre || !apellido || !correo || !password) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de correo inválido'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña debe tener al menos 6 caracteres'
    });
  }

  try {
    const usuarioExistente = db.prepare('SELECT id FROM usuarios WHERE correo = ?').get(correo);
    if (usuarioExistente) {
      return res.status(409).json({
        success: false,
        message: 'Este correo ya está registrado'
      });
    }

    const pacienteRol = db.prepare('SELECT id FROM roles WHERE nombre = ?').get('paciente');
    const result = db.prepare(`
      INSERT INTO usuarios (nombre, apellido, correo, password, rol_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(nombre, apellido, correo, password, pacienteRol.id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: result.lastInsertRowid,
        nombre,
        apellido,
        correo,
        rol: {
          nombre: 'paciente'
        }
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// ==================== ADMIN - ESTADÍSTICAS ====================

// Estadísticas del dashboard admin
app.get('/api/admin/estadisticas', (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    
    // Citas de hoy
    const citasHoy = db.prepare('SELECT COUNT(*) as count FROM citas WHERE fecha = ?').get(hoy);
    
    // Citas del mes actual
    const citasMesActual = db.prepare(`
      SELECT COUNT(*) as count FROM citas 
      WHERE strftime('%Y-%m', fecha) = strftime('%Y-%m', 'now')
    `).get();
    
    // Citas del mes anterior
    const citasMesAnterior = db.prepare(`
      SELECT COUNT(*) as count FROM citas 
      WHERE strftime('%Y-%m', fecha) = strftime('%Y-%m', date('now', '-1 month'))
    `).get();
    
    // Calcular porcentaje de cambio en citas
    const cambioCitas = citasMesAnterior.count > 0
      ? (((citasMesActual.count - citasMesAnterior.count) / citasMesAnterior.count) * 100).toFixed(1)
      : citasMesActual.count > 0 ? '100.0' : '0.0';
    const porcentajeCitas = citasMesActual.count >= citasMesAnterior.count 
      ? `+${cambioCitas}%` 
      : `${cambioCitas}%`;
    
    // Pacientes nuevos del mes actual
    const pacientesNuevosActual = db.prepare(`
      SELECT COUNT(*) as count FROM usuarios 
      WHERE rol_id = (SELECT id FROM roles WHERE nombre = 'paciente')
      AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
    `).get();
    
    // Pacientes nuevos del mes anterior
    const pacientesNuevosAnterior = db.prepare(`
      SELECT COUNT(*) as count FROM usuarios 
      WHERE rol_id = (SELECT id FROM roles WHERE nombre = 'paciente')
      AND strftime('%Y-%m', created_at) = strftime('%Y-%m', date('now', '-1 month'))
    `).get();
    
    // Calcular porcentaje de cambio en pacientes nuevos
    const cambioPacientes = pacientesNuevosAnterior.count > 0
      ? (((pacientesNuevosActual.count - pacientesNuevosAnterior.count) / pacientesNuevosAnterior.count) * 100).toFixed(1)
      : pacientesNuevosActual.count > 0 ? '100.0' : '0.0';
    const porcentajePacientes = pacientesNuevosActual.count >= pacientesNuevosAnterior.count 
      ? `+${cambioPacientes}%` 
      : `${cambioPacientes}%`;
    
    // Citas completadas del mes actual
    const citasCompletadasActual = db.prepare(`
      SELECT COUNT(*) as count FROM citas 
      WHERE estado = 'Completada'
      AND strftime('%Y-%m', fecha) = strftime('%Y-%m', 'now')
    `).get();
    
    // Citas completadas del mes anterior
    const citasCompletadasAnterior = db.prepare(`
      SELECT COUNT(*) as count FROM citas 
      WHERE estado = 'Completada'
      AND strftime('%Y-%m', fecha) = strftime('%Y-%m', date('now', '-1 month'))
    `).get();
    
    // Calcular ingresos del mes (simulado: $50 por cita completada)
    const ingresosMes = citasCompletadasActual.count * 50;
    const ingresosMesAnterior = citasCompletadasAnterior.count * 50;
    
    // Calcular porcentaje de cambio en ingresos
    const cambioIngresos = ingresosMesAnterior > 0
      ? (((ingresosMes - ingresosMesAnterior) / ingresosMesAnterior) * 100).toFixed(1)
      : ingresosMes > 0 ? '100.0' : '0.0';
    const porcentajeIngresos = ingresosMes >= ingresosMesAnterior 
      ? `+${cambioIngresos}%` 
      : `${cambioIngresos}%`;
    
    // Tasa de confirmación (citas completadas / total citas del mes)
    const totalCitasMes = citasMesActual.count;
    const tasaConfirmacion = totalCitasMes > 0 
      ? Math.round((citasCompletadasActual.count / totalCitasMes) * 100)
      : 0;
    
    // Tasa de confirmación del mes anterior
    const totalCitasMesAnterior = citasMesAnterior.count;
    const tasaConfirmacionAnterior = totalCitasMesAnterior > 0
      ? Math.round((citasCompletadasAnterior.count / totalCitasMesAnterior) * 100)
      : 0;
    
    // Calcular porcentaje de cambio en tasa de confirmación
    const cambioTasa = tasaConfirmacionAnterior > 0
      ? ((tasaConfirmacion - tasaConfirmacionAnterior)).toFixed(1)
      : tasaConfirmacion > 0 ? tasaConfirmacion.toFixed(1) : '0.0';
    const porcentajeTasa = tasaConfirmacion >= tasaConfirmacionAnterior 
      ? `+${cambioTasa}%` 
      : `${cambioTasa}%`;

    res.json({
      citas_hoy: citasHoy.count,
      ingresos_mes: ingresosMes,
      pacientes_nuevos: pacientesNuevosActual.count,
      tasa_confirmacion: tasaConfirmacion,
      porcentajes: {
        citas: porcentajeCitas,
        ingresos: porcentajeIngresos,
        pacientes: porcentajePacientes,
        tasa: porcentajeTasa
      }
    });
  } catch (error) {
    console.error('Error en estadísticas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Citas por día (gráfico)
app.get('/api/admin/citas-por-dia', (req, res) => {
  try {
    const citas = db.prepare(`
      SELECT 
        CASE CAST(strftime('%w', fecha) AS INTEGER)
          WHEN 0 THEN 'Dom'
          WHEN 1 THEN 'Lun'
          WHEN 2 THEN 'Mar'
          WHEN 3 THEN 'Mié'
          WHEN 4 THEN 'Jue'
          WHEN 5 THEN 'Vie'
          WHEN 6 THEN 'Sáb'
        END as name,
        COUNT(*) as citas
      FROM citas
      WHERE fecha >= date('now', '-7 days')
      GROUP BY strftime('%w', fecha)
      ORDER BY strftime('%w', fecha)
    `).all();

    // Asegurar que todos los días estén presentes
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const citasMap = {};
    citas.forEach(c => citasMap[c.name] = c.citas);
    
    const data = dias.map(dia => ({
      name: dia,
      citas: citasMap[dia] || 0
    }));

    res.json({ data });
  } catch (error) {
    console.error('Error en citas por día:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Estado de citas (gráfico)
app.get('/api/admin/estado-citas', (req, res) => {
  try {
    const estados = db.prepare(`
      SELECT estado as name, COUNT(*) as value
      FROM citas
      GROUP BY estado
    `).all();

    res.json({ data: estados });
  } catch (error) {
    console.error('Error en estado citas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ==================== PACIENTES ====================

// Lista de pacientes
app.get('/api/pacientes', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const pacientes = db.prepare(`
      SELECT 
        u.id,
        u.nombre || ' ' || u.apellido as nombre,
        u.correo,
        MAX(c.fecha) as fecha
      FROM usuarios u
      LEFT JOIN citas c ON u.id = c.paciente_id
      WHERE u.rol_id = (SELECT id FROM roles WHERE nombre = 'paciente')
      GROUP BY u.id, u.nombre, u.apellido, u.correo
      ORDER BY u.nombre
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    
    const total = db.prepare(`
      SELECT COUNT(DISTINCT u.id) as count
      FROM usuarios u
      WHERE u.rol_id = (SELECT id FROM roles WHERE nombre = 'paciente')
    `).get().count;

    res.json({
      data: pacientes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error en pacientes:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear paciente
app.post('/api/pacientes', (req, res) => {
  const { nombre, apellido, correo, password } = req.body;

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

  try {
    const usuarioExistente = db.prepare('SELECT id FROM usuarios WHERE correo = ?').get(correo);
    if (usuarioExistente) {
      return res.status(409).json({ 
        success: false,
        message: 'Este correo ya está registrado' 
      });
    }

    const pacienteRol = db.prepare('SELECT id FROM roles WHERE nombre = ?').get('paciente');
    const result = db.prepare(`
      INSERT INTO usuarios (nombre, apellido, correo, password, rol_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(nombre, apellido, correo, password, pacienteRol.id);

    res.status(201).json({ 
      success: true, 
      message: 'Paciente creado exitosamente',
      paciente: {
        id: result.lastInsertRowid,
        nombre: `${nombre} ${apellido}`,
        correo
      }
    });
  } catch (error) {
    console.error('Error creando paciente:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor' 
    });
  }
});

// ==================== DOCTORES ====================

// Lista de doctores
app.get('/api/doctores', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const doctores = db.prepare(`
      SELECT 
        d.id,
        u.nombre || ' ' || u.apellido as nombre,
        u.correo,
        d.especialidad
      FROM doctores d
      JOIN usuarios u ON d.usuario_id = u.id
      ORDER BY u.nombre
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    
    const total = db.prepare('SELECT COUNT(*) as count FROM doctores').get().count;

    res.json({
      data: doctores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error en doctores:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener doctor_id del usuario actual
app.get('/api/doctores/me', (req, res) => {
  try {
    const { usuario_id } = req.query;
    if (!usuario_id) {
      return res.status(400).json({ message: 'usuario_id requerido' });
    }
    const doctor = db.prepare('SELECT id FROM doctores WHERE usuario_id = ?').get(usuario_id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    res.json({ doctor_id: doctor.id });
  } catch (error) {
    console.error('Error obteniendo doctor_id:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Lista de doctores para nueva cita (especialistas)
app.get('/api/doctores/especialistas', (req, res) => {
  try {
    const doctores = db.prepare(`
      SELECT 
        d.id,
        u.nombre,
        u.apellido,
        d.especialidad
      FROM doctores d
      JOIN usuarios u ON d.usuario_id = u.id
      ORDER BY u.nombre
    `).all();

    res.json(doctores);
  } catch (error) {
    console.error('Error en especialistas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear doctor
app.post('/api/doctores', (req, res) => {
  const { nombre, apellido, correo, password, especialidad } = req.body;

  if (!nombre || !apellido || !correo || !password) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    const usuarioExistente = db.prepare('SELECT id FROM usuarios WHERE correo = ?').get(correo);
    if (usuarioExistente) {
      return res.status(409).json({ message: 'Este correo ya está registrado' });
    }

    const doctorRol = db.prepare('SELECT id FROM roles WHERE nombre = ?').get('doctor');
    const usuarioResult = db.prepare(`
      INSERT INTO usuarios (nombre, apellido, correo, password, rol_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(nombre, apellido, correo, password, doctorRol.id);

    db.prepare('INSERT INTO doctores (usuario_id, especialidad) VALUES (?, ?)')
      .run(usuarioResult.lastInsertRowid, especialidad || 'General');

    res.status(201).json({ success: true, message: 'Doctor creado exitosamente' });
  } catch (error) {
    console.error('Error creando doctor:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Actualizar doctor
app.put('/api/doctores/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, especialidad } = req.body;

  try {
    const doctor = db.prepare('SELECT usuario_id FROM doctores WHERE id = ?').get(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    db.prepare(`
      UPDATE usuarios 
      SET nombre = ?, apellido = ?, correo = ?
      WHERE id = ?
    `).run(nombre, apellido, correo, doctor.usuario_id);

    if (especialidad) {
      db.prepare('UPDATE doctores SET especialidad = ? WHERE id = ?').run(especialidad, id);
    }

    res.json({ success: true, message: 'Doctor actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando doctor:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar doctor
app.delete('/api/doctores/:id', (req, res) => {
  const { id } = req.params;

  try {
    const doctor = db.prepare('SELECT usuario_id FROM doctores WHERE id = ?').get(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    db.prepare('DELETE FROM usuarios WHERE id = ?').run(doctor.usuario_id);
    res.json({ success: true, message: 'Doctor eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando doctor:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ==================== CITAS ====================

// IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas con parámetros dinámicos
// Orden correcto: específicas primero, luego generales

// Próximas citas (tabla admin) - DEBE IR ANTES de /api/citas/:id
app.get('/api/citas/proximas', (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const citas = db.prepare(`
      SELECT 
        c.id as cita_id,
        c.id,
        u1.nombre || ' ' || u1.apellido as paciente,
        u2.nombre || ' ' || u2.apellido as doctor,
        c.nota as servicio,
        c.hora,
        c.fecha,
        c.estado
      FROM citas c
      LEFT JOIN usuarios u1 ON c.paciente_id = u1.id
      LEFT JOIN doctores d ON c.doctor_id = d.id
      LEFT JOIN usuarios u2 ON d.usuario_id = u2.id
      WHERE c.fecha >= ? AND c.estado != 'Cancelada'
      ORDER BY c.fecha, c.hora
      LIMIT 10
    `).all(hoy);

    console.log(`[API] Próximas citas encontradas: ${citas.length}`);
    res.json({ status: 'success', data: citas });
  } catch (error) {
    console.error('Error en próximas citas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Lista de citas (con filtros opcionales) - Ruta base
app.get('/api/citas', (req, res) => {
  try {
    const { paciente_id, doctor_id, fecha, estado } = req.query;
    
    let query = `
      SELECT 
        c.id,
        c.paciente_id,
        c.doctor_id,
        c.fecha,
        c.hora,
        c.estado,
        c.nota,
        u1.nombre || ' ' || u1.apellido as paciente_nombre,
        u1.apellido as paciente_apellido,
        u2.nombre || ' ' || u2.apellido as doctor_nombre,
        u2.apellido as doctor_apellido,
        c.nota as servicio
      FROM citas c
      JOIN usuarios u1 ON c.paciente_id = u1.id
      JOIN doctores d ON c.doctor_id = d.id
      JOIN usuarios u2 ON d.usuario_id = u2.id
      WHERE 1=1
    `;
    
    const params = [];
    if (paciente_id) {
      query += ' AND c.paciente_id = ?';
      params.push(paciente_id);
    }
    if (doctor_id) {
      query += ' AND c.doctor_id = ?';
      params.push(doctor_id);
    }
    if (fecha) {
      query += ' AND c.fecha = ?';
      params.push(fecha);
    }
    if (estado) {
      query += ' AND c.estado = ?';
      params.push(estado);
    }
    
    query += ' ORDER BY c.fecha, c.hora';

    const citas = db.prepare(query).all(...params);
    res.json(citas);
  } catch (error) {
    console.error('Error en citas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Citas para calendario
app.get('/api/citas/calendario', (req, res) => {
  try {
    const citas = db.prepare(`
      SELECT 
        c.id as cita_id,
        c.fecha,
        c.hora,
        c.estado,
        u1.nombre || ' ' || u1.apellido as paciente_nombre,
        u1.apellido as paciente_apellido,
        u2.nombre || ' ' || u2.apellido as doctor_nombre,
        u2.apellido as doctor_apellido,
        c.nota as servicio,
        c.nota as descripcion_servicio
      FROM citas c
      JOIN usuarios u1 ON c.paciente_id = u1.id
      JOIN doctores d ON c.doctor_id = d.id
      JOIN usuarios u2 ON d.usuario_id = u2.id
      ORDER BY c.fecha, c.hora
    `).all();

    res.json({ success: true, data: citas });
  } catch (error) {
    console.error('Error en calendario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Próxima cita del paciente
app.get('/api/citas/proxima', (req, res) => {
  try {
    const { usuario_id } = req.query;
    if (!usuario_id) {
      return res.status(400).json({ message: 'usuario_id requerido' });
    }

    const hoy = new Date().toISOString().split('T')[0];
    const cita = db.prepare(`
      SELECT 
        c.id,
        c.doctor_id,
        c.fecha || 'T' || c.hora as fecha_hora,
        c.nota as servicio,
        u2.nombre || ' ' || u2.apellido as doctor,
        c.nota as descripcion,
        '' as doctor_avatar
      FROM citas c
      JOIN doctores d ON c.doctor_id = d.id
      JOIN usuarios u2 ON d.usuario_id = u2.id
      WHERE c.paciente_id = ? AND c.fecha >= ? AND c.estado != 'Cancelada'
      ORDER BY c.fecha, c.hora
      LIMIT 1
    `).get(usuario_id, hoy);

    res.json(cita || null);
  } catch (error) {
    console.error('Error en próxima cita:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Historial de citas del paciente
app.get('/api/citas/historial', (req, res) => {
  try {
    const { usuario_id } = req.query;
    if (!usuario_id) {
      return res.status(400).json({ message: 'usuario_id requerido' });
    }

    const citas = db.prepare(`
      SELECT 
        c.id as cita_id,
        c.fecha || 'T' || c.hora as fechaHora,
        c.fecha,
        c.nota as servicio,
        c.nota as nombre,
        u2.nombre as doctor_nombre,
        u2.apellido as doctor_apellido,
        c.estado
      FROM citas c
      JOIN doctores d ON c.doctor_id = d.id
      JOIN usuarios u2 ON d.usuario_id = u2.id
      WHERE c.paciente_id = ?
      ORDER BY c.fecha DESC, c.hora DESC
      LIMIT 10
    `).all(usuario_id);

    res.json(citas);
  } catch (error) {
    console.error('Error en historial:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Citas del doctor
app.get('/api/citas/doctor/:doctorId', (req, res) => {
  try {
    const { doctorId } = req.params;
    const { fecha } = req.query;

    let query = `
      SELECT 
        c.id,
        c.paciente_id,
        c.fecha,
        c.hora,
        c.estado,
        c.nota as servicio,
        u1.nombre || ' ' || u1.apellido as paciente_nombre,
        u1.apellido as paciente_apellido
      FROM citas c
      JOIN usuarios u1 ON c.paciente_id = u1.id
      WHERE c.doctor_id = ?
    `;

    const params = [doctorId];
    if (fecha) {
      query += ' AND c.fecha = ?';
      params.push(fecha);
    }

    query += ' ORDER BY c.hora';

    const citas = db.prepare(query).all(...params);
    res.json({ success: true, citas });
  } catch (error) {
    console.error('Error en citas doctor:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear cita
app.post('/api/citas', (req, res) => {
  const { pacienteId, doctorId, fecha, hora, nota } = req.body;

  if (!pacienteId || !doctorId || !fecha || !hora) {
    return res.status(400).json({
      success: false,
      message: 'Datos incompletos'
    });
  }

  try {
    // Verificar que no haya conflicto de horario
    const conflicto = db.prepare(`
      SELECT id FROM citas 
      WHERE doctor_id = ? AND fecha = ? AND hora = ? AND estado != 'Cancelada'
    `).get(doctorId, fecha, hora);

    if (conflicto) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una cita en este horario'
      });
    }

    const result = db.prepare(`
      INSERT INTO citas (paciente_id, doctor_id, fecha, hora, estado, nota)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(pacienteId, doctorId, fecha, hora, 'Programada', nota || '');

    const cita = db.prepare(`
      SELECT 
        c.*,
        u1.nombre || ' ' || u1.apellido as paciente_nombre,
        u2.nombre || ' ' || u2.apellido as doctor_nombre
      FROM citas c
      JOIN usuarios u1 ON c.paciente_id = u1.id
      JOIN doctores d ON c.doctor_id = d.id
      JOIN usuarios u2 ON d.usuario_id = u2.id
      WHERE c.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      cita
    });
  } catch (error) {
    console.error('Error creando cita:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// Actualizar estado de cita
app.put('/api/citas/:id/estado', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ message: 'Estado requerido' });
  }

  try {
    db.prepare('UPDATE citas SET estado = ? WHERE id = ?').run(estado, id);
    res.json({ success: true, message: 'Estado actualizado' });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar cita
app.delete('/api/citas/:id', (req, res) => {
  const { id } = req.params;

  try {
    db.prepare('DELETE FROM citas WHERE id = ?').run(id);
    res.json({ success: true, message: 'Cita eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando cita:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Horas disponibles para un doctor en una fecha
app.get('/api/citas/horas-disponibles', (req, res) => {
  try {
    const { doctorId, fecha } = req.query;
    
    if (!doctorId || !fecha) {
      return res.status(400).json({ message: 'doctorId y fecha requeridos' });
    }

    // Horas disponibles (9:00 AM a 5:00 PM)
    const horasDisponibles = [];
    for (let hora = 9; hora <= 17; hora++) {
      horasDisponibles.push(`${hora.toString().padStart(2, '0')}:00`);
    }

    // Obtener horas ocupadas
    const citasOcupadas = db.prepare(`
      SELECT hora FROM citas 
      WHERE doctor_id = ? AND fecha = ? AND estado != 'Cancelada'
    `).all(doctorId, fecha);

    const horasOcupadas = citasOcupadas.map(c => c.hora);
    const horasLibres = horasDisponibles.filter(h => !horasOcupadas.includes(h));

    res.json({ horas: horasLibres });
  } catch (error) {
    console.error('Error en horas disponibles:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener una cita por ID (DEBE IR AL FINAL, después de todas las rutas específicas)
app.get('/api/citas/:id', (req, res) => {
  try {
    const { id } = req.params;
    const citaId = parseInt(id);
    
    console.log(`[API] Buscando cita con ID: ${citaId}`);
    
    if (isNaN(citaId)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID de cita inválido' 
      });
    }
    
    // Primero verificar que la cita existe
    const citaExiste = db.prepare('SELECT id FROM citas WHERE id = ?').get(citaId);
    if (!citaExiste) {
      console.log(`[API] Cita con ID ${citaId} no encontrada en la base de datos`);
      return res.status(404).json({ 
        success: false,
        message: 'Cita no encontrada' 
      });
    }
    
    const cita = db.prepare(`
      SELECT 
        c.id,
        c.paciente_id,
        c.doctor_id,
        c.fecha,
        c.hora,
        c.estado,
        c.nota,
        c.created_at,
        u1.id as paciente_usuario_id,
        u1.nombre as paciente_nombre,
        u1.apellido as paciente_apellido,
        u1.correo as paciente_correo,
        u2.id as doctor_usuario_id,
        u2.nombre as doctor_nombre,
        u2.apellido as doctor_apellido,
        u2.correo as doctor_correo,
        d.especialidad as doctor_especialidad
      FROM citas c
      LEFT JOIN usuarios u1 ON c.paciente_id = u1.id
      LEFT JOIN doctores d ON c.doctor_id = d.id
      LEFT JOIN usuarios u2 ON d.usuario_id = u2.id
      WHERE c.id = ?
    `).get(citaId);

    if (!cita) {
      console.log(`[API] Error al obtener detalles de la cita ${citaId}`);
      return res.status(404).json({ 
        success: false,
        message: 'Cita no encontrada' 
      });
    }
    
    console.log(`[API] Cita ${citaId} encontrada exitosamente`);

    res.json({
      success: true,
      data: {
        id: cita.id,
        fecha: cita.fecha,
        hora: cita.hora,
        estado: cita.estado,
        nota: cita.nota,
        created_at: cita.created_at,
        paciente: {
          id: cita.paciente_usuario_id,
          nombre: cita.paciente_nombre || '',
          apellido: cita.paciente_apellido || '',
          nombre_completo: `${cita.paciente_nombre || ''} ${cita.paciente_apellido || ''}`.trim() || 'Paciente',
          correo: cita.paciente_correo || ''
        },
        doctor: {
          id: cita.doctor_usuario_id,
          nombre: cita.doctor_nombre || '',
          apellido: cita.doctor_apellido || '',
          nombre_completo: `Dr. ${cita.doctor_nombre || ''} ${cita.doctor_apellido || ''}`.trim() || 'Doctor',
          correo: cita.doctor_correo || '',
          especialidad: cita.doctor_especialidad || ''
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo cita:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor' 
    });
  }
});

// ==================== HELPER PARA PAGINACIÓN ====================
const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

// ==================== HELPER PARA OBTENER DOCTOR_ID ====================
const getDoctorIdFromUsuarioId = (usuario_id) => {
  if (!usuario_id) return null;
  const doctor = db.prepare('SELECT id FROM doctores WHERE usuario_id = ?').get(usuario_id);
  return doctor ? doctor.id : null;
};

// ==================== TRATAMIENTOS ====================
// Listar tratamientos con paginación
app.get('/api/tratamientos', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const tratamientos = db.prepare(`
      SELECT * FROM tratamientos 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM tratamientos').get().count;
    res.json({
      data: tratamientos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error en tratamientos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear tratamiento
app.post('/api/tratamientos', (req, res) => {
  const { nombre, descripcion, precio, duracion_minutos } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ message: 'Nombre y precio son requeridos' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO tratamientos (nombre, descripcion, precio, duracion_minutos)
      VALUES (?, ?, ?, ?)
    `).run(nombre, descripcion || null, precio, duracion_minutos || null);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creando tratamiento:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Actualizar tratamiento
app.put('/api/tratamientos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, duracion_minutos } = req.body;
  try {
    db.prepare(`
      UPDATE tratamientos 
      SET nombre = ?, descripcion = ?, precio = ?, duracion_minutos = ?
      WHERE id = ?
    `).run(nombre, descripcion, precio, duracion_minutos, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando tratamiento:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar tratamiento
app.delete('/api/tratamientos/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM tratamientos WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando tratamiento:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ==================== PROCEDIMIENTOS ====================
app.get('/api/procedimientos', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const procedimientos = db.prepare(`
      SELECT * FROM procedimientos 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM procedimientos').get().count;
    res.json({
      data: procedimientos,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error en procedimientos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.post('/api/procedimientos', (req, res) => {
  const { nombre, descripcion, tipo, costo } = req.body;
  if (!nombre) {
    return res.status(400).json({ message: 'Nombre es requerido' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO procedimientos (nombre, descripcion, tipo, costo)
      VALUES (?, ?, ?, ?)
    `).run(nombre, descripcion || null, tipo || null, costo || null);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creando procedimiento:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.put('/api/procedimientos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, tipo, costo } = req.body;
  try {
    db.prepare(`
      UPDATE procedimientos 
      SET nombre = ?, descripcion = ?, tipo = ?, costo = ?
      WHERE id = ?
    `).run(nombre, descripcion, tipo, costo, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando procedimiento:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.delete('/api/procedimientos/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM procedimientos WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando procedimiento:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ==================== MATERIALES ====================
app.get('/api/materiales', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const materiales = db.prepare(`
      SELECT * FROM materiales 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM materiales').get().count;
    res.json({
      data: materiales,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error en materiales:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.post('/api/materiales', (req, res) => {
  const { nombre, descripcion, unidad, precio_unitario } = req.body;
  if (!nombre) {
    return res.status(400).json({ message: 'Nombre es requerido' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO materiales (nombre, descripcion, unidad, precio_unitario)
      VALUES (?, ?, ?, ?)
    `).run(nombre, descripcion || null, unidad || null, precio_unitario || null);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creando material:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.put('/api/materiales/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, unidad, precio_unitario } = req.body;
  try {
    db.prepare(`
      UPDATE materiales 
      SET nombre = ?, descripcion = ?, unidad = ?, precio_unitario = ?
      WHERE id = ?
    `).run(nombre, descripcion, unidad, precio_unitario, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando material:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.delete('/api/materiales/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM materiales WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando material:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ==================== EQUIPOS ====================
app.get('/api/equipos', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const equipos = db.prepare(`
      SELECT * FROM equipos 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM equipos').get().count;
    res.json({
      data: equipos,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error en equipos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.post('/api/equipos', (req, res) => {
  const { nombre, marca, modelo, numero_serie, estado, fecha_adquisicion } = req.body;
  if (!nombre) {
    return res.status(400).json({ message: 'Nombre es requerido' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO equipos (nombre, marca, modelo, numero_serie, estado, fecha_adquisicion)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(nombre, marca || null, modelo || null, numero_serie || null, estado || 'Activo', fecha_adquisicion || null);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creando equipo:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.put('/api/equipos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, marca, modelo, numero_serie, estado, fecha_adquisicion } = req.body;
  try {
    db.prepare(`
      UPDATE equipos 
      SET nombre = ?, marca = ?, modelo = ?, numero_serie = ?, estado = ?, fecha_adquisicion = ?
      WHERE id = ?
    `).run(nombre, marca, modelo, numero_serie, estado, fecha_adquisicion, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando equipo:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.delete('/api/equipos/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM equipos WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando equipo:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ==================== PROVEEDORES ====================
app.get('/api/proveedores', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const proveedores = db.prepare(`
      SELECT * FROM proveedores 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM proveedores').get().count;
    res.json({
      data: proveedores,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error en proveedores:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.post('/api/proveedores', (req, res) => {
  const { nombre, contacto, telefono, correo, direccion } = req.body;
  if (!nombre) {
    return res.status(400).json({ message: 'Nombre es requerido' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion)
      VALUES (?, ?, ?, ?, ?)
    `).run(nombre, contacto || null, telefono || null, correo || null, direccion || null);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creando proveedor:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.put('/api/proveedores/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, contacto, telefono, correo, direccion } = req.body;
  try {
    db.prepare(`
      UPDATE proveedores 
      SET nombre = ?, contacto = ?, telefono = ?, correo = ?, direccion = ?
      WHERE id = ?
    `).run(nombre, contacto, telefono, correo, direccion, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando proveedor:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.delete('/api/proveedores/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM proveedores WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando proveedor:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ==================== INVENTARIO ====================
app.get('/api/inventario', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const inventario = db.prepare(`
      SELECT 
        i.*,
        m.nombre as material_nombre,
        p.nombre as proveedor_nombre
      FROM inventario i
      LEFT JOIN materiales m ON i.material_id = m.id
      LEFT JOIN proveedores p ON i.proveedor_id = p.id
      ORDER BY i.created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM inventario').get().count;
    res.json({
      data: inventario,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error en inventario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.post('/api/inventario', (req, res) => {
  const { material_id, proveedor_id, cantidad, cantidad_minima, ubicacion } = req.body;
  if (!cantidad) {
    return res.status(400).json({ message: 'Cantidad es requerida' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO inventario (material_id, proveedor_id, cantidad, cantidad_minima, ubicacion)
      VALUES (?, ?, ?, ?, ?)
    `).run(material_id || null, proveedor_id || null, cantidad, cantidad_minima || 0, ubicacion || null);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creando inventario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.put('/api/inventario/:id', (req, res) => {
  const { id } = req.params;
  const { material_id, proveedor_id, cantidad, cantidad_minima, ubicacion } = req.body;
  try {
    db.prepare(`
      UPDATE inventario 
      SET material_id = ?, proveedor_id = ?, cantidad = ?, cantidad_minima = ?, ubicacion = ?
      WHERE id = ?
    `).run(material_id, proveedor_id, cantidad, cantidad_minima, ubicacion, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando inventario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.delete('/api/inventario/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM inventario WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando inventario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ==================== SERVICIOS ====================
app.get('/api/servicios', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const servicios = db.prepare(`
      SELECT * FROM servicios 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM servicios').get().count;
    res.json({
      data: servicios,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error en servicios:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.post('/api/servicios', (req, res) => {
  const { nombre, descripcion, precio, categoria, activo } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ message: 'Nombre y precio son requeridos' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO servicios (nombre, descripcion, precio, categoria, activo)
      VALUES (?, ?, ?, ?, ?)
    `).run(nombre, descripcion || null, precio, categoria || null, activo !== undefined ? activo : 1);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creando servicio:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.put('/api/servicios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, categoria, activo } = req.body;
  try {
    db.prepare(`
      UPDATE servicios 
      SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, activo = ?
      WHERE id = ?
    `).run(nombre, descripcion, precio, categoria, activo, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando servicio:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.delete('/api/servicios/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM servicios WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando servicio:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ==================== ESPECIALIDADES ====================
app.get('/api/especialidades', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const especialidades = db.prepare(`
      SELECT * FROM especialidades 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM especialidades').get().count;
    res.json({
      data: especialidades,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error en especialidades:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.post('/api/especialidades', (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) {
    return res.status(400).json({ message: 'Nombre es requerido' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO especialidades (nombre, descripcion)
      VALUES (?, ?)
    `).run(nombre, descripcion || null);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creando especialidad:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.put('/api/especialidades/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    db.prepare(`
      UPDATE especialidades 
      SET nombre = ?, descripcion = ?
      WHERE id = ?
    `).run(nombre, descripcion, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando especialidad:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.delete('/api/especialidades/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM especialidades WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando especialidad:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ==================== HORARIOS ====================
app.get('/api/horarios', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { usuario_id } = req.query;
    
    let query = `
      SELECT 
        h.*,
        u.nombre || ' ' || u.apellido as doctor_nombre
      FROM horarios h
      LEFT JOIN doctores d ON h.doctor_id = d.id
      LEFT JOIN usuarios u ON d.usuario_id = u.id
    `;
    
    const params = [];
    if (usuario_id) {
      query += ' WHERE d.usuario_id = ?';
      params.push(usuario_id);
    }
    
    query += ' ORDER BY h.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const horarios = db.prepare(query).all(...params);
    
    let countQuery = 'SELECT COUNT(*) as count FROM horarios h';
    if (usuario_id) {
      countQuery += ' JOIN doctores d ON h.doctor_id = d.id WHERE d.usuario_id = ?';
      const total = db.prepare(countQuery).get(usuario_id).count;
      res.json({
        data: horarios,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    } else {
      const total = db.prepare('SELECT COUNT(*) as count FROM horarios').get().count;
      res.json({
        data: horarios,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    }
  } catch (error) {
    console.error('Error en horarios:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.post('/api/horarios', (req, res) => {
  const { doctor_id, dia_semana, hora_inicio, hora_fin, activo } = req.body;
  if (!dia_semana || !hora_inicio || !hora_fin) {
    return res.status(400).json({ message: 'Día, hora inicio y hora fin son requeridos' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO horarios (doctor_id, dia_semana, hora_inicio, hora_fin, activo)
      VALUES (?, ?, ?, ?, ?)
    `).run(doctor_id || null, dia_semana, hora_inicio, hora_fin, activo !== undefined ? activo : 1);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creando horario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.put('/api/horarios/:id', (req, res) => {
  const { id } = req.params;
  const { doctor_id, dia_semana, hora_inicio, hora_fin, activo } = req.body;
  try {
    db.prepare(`
      UPDATE horarios 
      SET doctor_id = ?, dia_semana = ?, hora_inicio = ?, hora_fin = ?, activo = ?
      WHERE id = ?
    `).run(doctor_id, dia_semana, hora_inicio, hora_fin, activo, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando horario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.delete('/api/horarios/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM horarios WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando horario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ==================== NOTAS ====================
app.get('/api/notas', (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { usuario_id } = req.query;
    
    let query = `
      SELECT 
        n.*,
        u1.nombre || ' ' || u1.apellido as paciente_nombre,
        u2.nombre || ' ' || u2.apellido as doctor_nombre
      FROM notas n
      LEFT JOIN usuarios u1 ON n.paciente_id = u1.id
      LEFT JOIN doctores d ON n.doctor_id = d.id
      LEFT JOIN usuarios u2 ON d.usuario_id = u2.id
    `;
    
    const params = [];
    if (usuario_id) {
      query += ' WHERE d.usuario_id = ?';
      params.push(usuario_id);
    }
    
    query += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const notas = db.prepare(query).all(...params);
    
    let countQuery = 'SELECT COUNT(*) as count FROM notas n';
    if (usuario_id) {
      countQuery += ' JOIN doctores d ON n.doctor_id = d.id WHERE d.usuario_id = ?';
      const total = db.prepare(countQuery).get(usuario_id).count;
      res.json({
        data: notas,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    } else {
      const total = db.prepare('SELECT COUNT(*) as count FROM notas').get().count;
      res.json({
        data: notas,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    }
  } catch (error) {
    console.error('Error en notas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.post('/api/notas', (req, res) => {
  const { paciente_id, doctor_id, titulo, contenido, fecha } = req.body;
  if (!titulo || !fecha) {
    return res.status(400).json({ message: 'Título y fecha son requeridos' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO notas (paciente_id, doctor_id, titulo, contenido, fecha)
      VALUES (?, ?, ?, ?, ?)
    `).run(paciente_id || null, doctor_id || null, titulo, contenido || null, fecha);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creando nota:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.put('/api/notas/:id', (req, res) => {
  const { id } = req.params;
  const { paciente_id, doctor_id, titulo, contenido, fecha } = req.body;
  try {
    db.prepare(`
      UPDATE notas 
      SET paciente_id = ?, doctor_id = ?, titulo = ?, contenido = ?, fecha = ?
      WHERE id = ?
    `).run(paciente_id, doctor_id, titulo, contenido, fecha, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando nota:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.delete('/api/notas/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM notas WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando nota:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
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
