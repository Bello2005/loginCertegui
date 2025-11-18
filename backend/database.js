import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear conexión a la base de datos
const db = new Database(path.join(__dirname, 'database.sqlite'));

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Crear tablas si no existen
const initDatabase = () => {
  // Tabla de roles
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE
    );
  `);

  // Tabla de usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      correo TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      rol_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rol_id) REFERENCES roles(id)
    );
  `);

  // Tabla de doctores (extiende usuarios)
  db.exec(`
    CREATE TABLE IF NOT EXISTS doctores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL UNIQUE,
      especialidad TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
  `);

  // Tabla de citas
  db.exec(`
    CREATE TABLE IF NOT EXISTS citas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      fecha DATE NOT NULL,
      hora TIME NOT NULL,
      estado TEXT NOT NULL DEFAULT 'Programada',
      nota TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE
    );
  `);

  // Tabla de tratamientos
  db.exec(`
    CREATE TABLE IF NOT EXISTS tratamientos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio DECIMAL(10, 2) NOT NULL,
      duracion_minutos INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de procedimientos
  db.exec(`
    CREATE TABLE IF NOT EXISTS procedimientos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      tipo TEXT,
      costo DECIMAL(10, 2),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de materiales
  db.exec(`
    CREATE TABLE IF NOT EXISTS materiales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      unidad TEXT,
      precio_unitario DECIMAL(10, 2),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de equipos
  db.exec(`
    CREATE TABLE IF NOT EXISTS equipos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      marca TEXT,
      modelo TEXT,
      numero_serie TEXT,
      estado TEXT DEFAULT 'Activo',
      fecha_adquisicion DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de proveedores
  db.exec(`
    CREATE TABLE IF NOT EXISTS proveedores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      contacto TEXT,
      telefono TEXT,
      correo TEXT,
      direccion TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de inventario
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      material_id INTEGER,
      proveedor_id INTEGER,
      cantidad INTEGER NOT NULL,
      cantidad_minima INTEGER DEFAULT 0,
      ubicacion TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (material_id) REFERENCES materiales(id) ON DELETE SET NULL,
      FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
    );
  `);

  // Tabla de servicios
  db.exec(`
    CREATE TABLE IF NOT EXISTS servicios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio DECIMAL(10, 2) NOT NULL,
      categoria TEXT,
      activo INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de especialidades
  db.exec(`
    CREATE TABLE IF NOT EXISTS especialidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      descripcion TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de horarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS horarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doctor_id INTEGER,
      dia_semana TEXT NOT NULL,
      hora_inicio TIME NOT NULL,
      hora_fin TIME NOT NULL,
      activo INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE
    );
  `);

  // Tabla de notas
  db.exec(`
    CREATE TABLE IF NOT EXISTS notas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER,
      doctor_id INTEGER,
      titulo TEXT NOT NULL,
      contenido TEXT,
      fecha DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE SET NULL
    );
  `);

  // Insertar roles iniciales si no existen
  const rolesCount = db.prepare('SELECT COUNT(*) as count FROM roles').get();
  if (rolesCount.count === 0) {
    db.prepare('INSERT INTO roles (nombre) VALUES (?)').run('admin');
    db.prepare('INSERT INTO roles (nombre) VALUES (?)').run('doctor');
    db.prepare('INSERT INTO roles (nombre) VALUES (?)').run('paciente');
  }

  // Insertar usuarios de prueba si no existen
  const usuariosCount = db.prepare('SELECT COUNT(*) as count FROM usuarios').get();
  if (usuariosCount.count === 0) {
    const adminRol = db.prepare('SELECT id FROM roles WHERE nombre = ?').get('admin');
    const doctorRol = db.prepare('SELECT id FROM roles WHERE nombre = ?').get('doctor');
    const pacienteRol = db.prepare('SELECT id FROM roles WHERE nombre = ?').get('paciente');

    // Admin
    const adminId = db.prepare(`
      INSERT INTO usuarios (nombre, apellido, correo, password, rol_id)
      VALUES (?, ?, ?, ?, ?)
    `).run('Administrador', 'Sistema', 'admin@gmail.com', '123456', adminRol.id).lastInsertRowid;

    // Doctor
    const doctorId = db.prepare(`
      INSERT INTO usuarios (nombre, apellido, correo, password, rol_id)
      VALUES (?, ?, ?, ?, ?)
    `).run('Dr. Juan', 'Pérez', 'doctor@gmail.com', '123456', doctorRol.id).lastInsertRowid;

    db.prepare('INSERT INTO doctores (usuario_id, especialidad) VALUES (?, ?)')
      .run(doctorId, 'Ortodoncia');

    // Paciente
    const pacienteId = db.prepare(`
      INSERT INTO usuarios (nombre, apellido, correo, password, rol_id)
      VALUES (?, ?, ?, ?, ?)
    `).run('María', 'González', 'paciente@gmail.com', '123456', pacienteRol.id).lastInsertRowid;

    // Crear algunas citas de ejemplo
    const doctorDbId = db.prepare('SELECT id FROM doctores WHERE usuario_id = ?').get(doctorId).id;
    
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    db.prepare(`
      INSERT INTO citas (paciente_id, doctor_id, fecha, hora, estado, nota)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(pacienteId, doctorDbId, hoy.toISOString().split('T')[0], '09:00', 'Programada', 'Consulta general');
    
    db.prepare(`
      INSERT INTO citas (paciente_id, doctor_id, fecha, hora, estado, nota)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(pacienteId, doctorDbId, mañana.toISOString().split('T')[0], '10:30', 'Programada', 'Revisión');
  }

  // Insertar datos de prueba para tratamientos
  const tratamientosCount = db.prepare('SELECT COUNT(*) as count FROM tratamientos').get();
  if (tratamientosCount.count === 0) {
    db.prepare('INSERT INTO tratamientos (nombre, descripcion, precio, duracion_minutos) VALUES (?, ?, ?, ?)')
      .run('Ortodoncia Tradicional', 'Tratamiento con brackets metálicos', 5000.00, 120);
    db.prepare('INSERT INTO tratamientos (nombre, descripcion, precio, duracion_minutos) VALUES (?, ?, ?, ?)')
      .run('Invisalign', 'Tratamiento con alineadores transparentes', 8000.00, 90);
    db.prepare('INSERT INTO tratamientos (nombre, descripcion, precio, duracion_minutos) VALUES (?, ?, ?, ?)')
      .run('Limpieza Profunda', 'Limpieza dental profesional', 150.00, 60);
    db.prepare('INSERT INTO tratamientos (nombre, descripcion, precio, duracion_minutos) VALUES (?, ?, ?, ?)')
      .run('Blanqueamiento', 'Blanqueamiento dental', 300.00, 45);
  }

  // Insertar datos de prueba para procedimientos
  const procedimientosCount = db.prepare('SELECT COUNT(*) as count FROM procedimientos').get();
  if (procedimientosCount.count === 0) {
    db.prepare('INSERT INTO procedimientos (nombre, descripcion, tipo, costo) VALUES (?, ?, ?, ?)')
      .run('Extracción Simple', 'Extracción de diente sin complicaciones', 'Cirugía', 200.00);
    db.prepare('INSERT INTO procedimientos (nombre, descripcion, tipo, costo) VALUES (?, ?, ?, ?)')
      .run('Endodoncia', 'Tratamiento de conducto', 'Endodoncia', 500.00);
    db.prepare('INSERT INTO procedimientos (nombre, descripcion, tipo, costo) VALUES (?, ?, ?, ?)')
      .run('Implante Dental', 'Colocación de implante', 'Cirugía', 1500.00);
  }

  // Insertar datos de prueba para materiales
  const materialesCount = db.prepare('SELECT COUNT(*) as count FROM materiales').get();
  if (materialesCount.count === 0) {
    db.prepare('INSERT INTO materiales (nombre, descripcion, unidad, precio_unitario) VALUES (?, ?, ?, ?)')
      .run('Brackets Metálicos', 'Brackets de acero inoxidable', 'unidad', 25.00);
    db.prepare('INSERT INTO materiales (nombre, descripcion, unidad, precio_unitario) VALUES (?, ?, ?, ?)')
      .run('Alambre Ortodóncico', 'Alambre para brackets', 'metro', 15.00);
    db.prepare('INSERT INTO materiales (nombre, descripcion, unidad, precio_unitario) VALUES (?, ?, ?, ?)')
      .run('Resina Dental', 'Resina para restauraciones', 'gramo', 8.50);
    db.prepare('INSERT INTO materiales (nombre, descripcion, unidad, precio_unitario) VALUES (?, ?, ?, ?)')
      .run('Anestesia Local', 'Anestesia para procedimientos', 'ml', 12.00);
  }

  // Insertar datos de prueba para equipos
  const equiposCount = db.prepare('SELECT COUNT(*) as count FROM equipos').get();
  if (equiposCount.count === 0) {
    db.prepare('INSERT INTO equipos (nombre, marca, modelo, numero_serie, estado, fecha_adquisicion) VALUES (?, ?, ?, ?, ?, ?)')
      .run('Silla Dental', 'A-dec', '300', 'AD300-001', 'Activo', '2023-01-15');
    db.prepare('INSERT INTO equipos (nombre, marca, modelo, numero_serie, estado, fecha_adquisicion) VALUES (?, ?, ?, ?, ?, ?)')
      .run('Radiografía Digital', 'Carestream', 'RVG 6200', 'CS6200-045', 'Activo', '2023-03-20');
    db.prepare('INSERT INTO equipos (nombre, marca, modelo, numero_serie, estado, fecha_adquisicion) VALUES (?, ?, ?, ?, ?, ?)')
      .run('Autoclave', 'Tuttnauer', '3870EA', 'TT3870-123', 'Activo', '2022-11-10');
    db.prepare('INSERT INTO equipos (nombre, marca, modelo, numero_serie, estado, fecha_adquisicion) VALUES (?, ?, ?, ?, ?, ?)')
      .run('Lámpara de Polimerización', '3M', 'Elipar S10', '3M-ES10-789', 'Activo', '2023-06-05');
  }

  // Insertar datos de prueba para proveedores
  const proveedoresCount = db.prepare('SELECT COUNT(*) as count FROM proveedores').get();
  if (proveedoresCount.count === 0) {
    db.prepare('INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)')
      .run('Dental Supplies Co.', 'Juan Martínez', '555-0101', 'ventas@dentalsupplies.com', 'Av. Principal 123');
    db.prepare('INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)')
      .run('Ortho Materials', 'María López', '555-0202', 'info@orthomaterials.com', 'Calle Comercial 456');
    db.prepare('INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)')
      .run('MedTech Solutions', 'Carlos Rodríguez', '555-0303', 'contacto@medtech.com', 'Boulevard Industrial 789');
  }

  // Insertar datos de prueba para servicios
  const serviciosCount = db.prepare('SELECT COUNT(*) as count FROM servicios').get();
  if (serviciosCount.count === 0) {
    db.prepare('INSERT INTO servicios (nombre, descripcion, precio, categoria, activo) VALUES (?, ?, ?, ?, ?)')
      .run('Consulta General', 'Consulta odontológica general', 50.00, 'Consulta', 1);
    db.prepare('INSERT INTO servicios (nombre, descripcion, precio, categoria, activo) VALUES (?, ?, ?, ?, ?)')
      .run('Limpieza Dental', 'Limpieza profesional de dientes', 80.00, 'Prevención', 1);
    db.prepare('INSERT INTO servicios (nombre, descripcion, precio, categoria, activo) VALUES (?, ?, ?, ?, ?)')
      .run('Ortodoncia', 'Tratamiento ortodóncico completo', 5000.00, 'Ortodoncia', 1);
    db.prepare('INSERT INTO servicios (nombre, descripcion, precio, categoria, activo) VALUES (?, ?, ?, ?, ?)')
      .run('Blanqueamiento', 'Blanqueamiento dental', 250.00, 'Estética', 1);
    db.prepare('INSERT INTO servicios (nombre, descripcion, precio, categoria, activo) VALUES (?, ?, ?, ?, ?)')
      .run('Endodoncia', 'Tratamiento de conducto', 400.00, 'Endodoncia', 1);
  }

  // Insertar datos de prueba para especialidades
  const especialidadesCount = db.prepare('SELECT COUNT(*) as count FROM especialidades').get();
  if (especialidadesCount.count === 0) {
    db.prepare('INSERT INTO especialidades (nombre, descripcion) VALUES (?, ?)')
      .run('Ortodoncia', 'Especialidad en corrección de dientes y mandíbulas');
    db.prepare('INSERT INTO especialidades (nombre, descripcion) VALUES (?, ?)')
      .run('Endodoncia', 'Tratamiento de enfermedades de la pulpa dental');
    db.prepare('INSERT INTO especialidades (nombre, descripcion) VALUES (?, ?)')
      .run('Periodoncia', 'Tratamiento de enfermedades de las encías');
    db.prepare('INSERT INTO especialidades (nombre, descripcion) VALUES (?, ?)')
      .run('Odontopediatría', 'Odontología para niños');
    db.prepare('INSERT INTO especialidades (nombre, descripcion) VALUES (?, ?)')
      .run('Estética Dental', 'Tratamientos estéticos dentales');
  }

  // Insertar datos de prueba para horarios (del doctor existente)
  const horariosCount = db.prepare('SELECT COUNT(*) as count FROM horarios').get();
  if (horariosCount.count === 0) {
    const doctorDbId = db.prepare('SELECT id FROM doctores LIMIT 1').get()?.id;
    if (doctorDbId) {
      // Lunes a Viernes: 9:00 AM - 5:00 PM
      const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
      diasSemana.forEach(dia => {
        db.prepare('INSERT INTO horarios (doctor_id, dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, ?, ?)')
          .run(doctorDbId, dia, '09:00', '17:00', 1);
      });
    }
  }

  // Insertar datos de prueba para inventario
  const inventarioCount = db.prepare('SELECT COUNT(*) as count FROM inventario').get();
  if (inventarioCount.count === 0) {
    const material1 = db.prepare('SELECT id FROM materiales WHERE nombre = ?').get('Brackets Metálicos')?.id;
    const material2 = db.prepare('SELECT id FROM materiales WHERE nombre = ?').get('Alambre Ortodóncico')?.id;
    const proveedor1 = db.prepare('SELECT id FROM proveedores LIMIT 1').get()?.id;
    
    if (material1 && proveedor1) {
      db.prepare('INSERT INTO inventario (material_id, proveedor_id, cantidad, cantidad_minima, ubicacion) VALUES (?, ?, ?, ?, ?)')
        .run(material1, proveedor1, 100, 20, 'Almacén A - Estante 3');
    }
    if (material2 && proveedor1) {
      db.prepare('INSERT INTO inventario (material_id, proveedor_id, cantidad, cantidad_minima, ubicacion) VALUES (?, ?, ?, ?, ?)')
        .run(material2, proveedor1, 50, 10, 'Almacén A - Estante 2');
    }
  }

  // Insertar datos de prueba para notas
  const notasCount = db.prepare('SELECT COUNT(*) as count FROM notas').get();
  if (notasCount.count === 0) {
    const pacienteId = db.prepare('SELECT id FROM usuarios WHERE rol_id = (SELECT id FROM roles WHERE nombre = ?) LIMIT 1').get('paciente')?.id;
    const doctorDbId = db.prepare('SELECT id FROM doctores LIMIT 1').get()?.id;
    
    if (pacienteId && doctorDbId) {
      const hoy = new Date().toISOString().split('T')[0];
      db.prepare('INSERT INTO notas (paciente_id, doctor_id, titulo, contenido, fecha) VALUES (?, ?, ?, ?, ?)')
        .run(pacienteId, doctorDbId, 'Primera Consulta', 'Paciente presenta buena salud dental. Se recomienda limpieza cada 6 meses.', hoy);
      
      const ayer = new Date();
      ayer.setDate(ayer.getDate() - 1);
      db.prepare('INSERT INTO notas (paciente_id, doctor_id, titulo, contenido, fecha) VALUES (?, ?, ?, ?, ?)')
        .run(pacienteId, doctorDbId, 'Seguimiento Ortodóncico', 'Ajuste de brackets realizado. Próxima cita en 4 semanas.', ayer.toISOString().split('T')[0]);
    }
  }

  // Añadir más doctores y pacientes de prueba
  const totalUsuarios = db.prepare('SELECT COUNT(*) as count FROM usuarios').get().count;
  if (totalUsuarios < 10) {
    const doctorRol = db.prepare('SELECT id FROM roles WHERE nombre = ?').get('doctor');
    const pacienteRol = db.prepare('SELECT id FROM roles WHERE nombre = ?').get('paciente');

    // Más doctores
    const doctoresPrueba = [
      { nombre: 'Dr. Carlos', apellido: 'Rodríguez', correo: 'carlos.doctor@gmail.com', especialidad: 'Endodoncia' },
      { nombre: 'Dra. Ana', apellido: 'Martínez', correo: 'ana.doctor@gmail.com', especialidad: 'Periodoncia' },
      { nombre: 'Dr. Luis', apellido: 'García', correo: 'luis.doctor@gmail.com', especialidad: 'Odontopediatría' }
    ];

    doctoresPrueba.forEach(doc => {
      const usuarioId = db.prepare(`
        INSERT INTO usuarios (nombre, apellido, correo, password, rol_id)
        VALUES (?, ?, ?, ?, ?)
      `).run(doc.nombre, doc.apellido, doc.correo, '123456', doctorRol.id).lastInsertRowid;
      
      db.prepare('INSERT INTO doctores (usuario_id, especialidad) VALUES (?, ?)')
        .run(usuarioId, doc.especialidad);
    });

    // Más pacientes
    const pacientesPrueba = [
      { nombre: 'Juan', apellido: 'Pérez', correo: 'juan.paciente@gmail.com' },
      { nombre: 'Laura', apellido: 'Sánchez', correo: 'laura.paciente@gmail.com' },
      { nombre: 'Pedro', apellido: 'González', correo: 'pedro.paciente@gmail.com' },
      { nombre: 'Carmen', apellido: 'López', correo: 'carmen.paciente@gmail.com' },
      { nombre: 'Roberto', apellido: 'Fernández', correo: 'roberto.paciente@gmail.com' }
    ];

    pacientesPrueba.forEach(pac => {
      db.prepare(`
        INSERT INTO usuarios (nombre, apellido, correo, password, rol_id)
        VALUES (?, ?, ?, ?, ?)
      `).run(pac.nombre, pac.apellido, pac.correo, '123456', pacienteRol.id);
    });

    // Crear más citas de ejemplo
    const todosDoctores = db.prepare('SELECT id FROM doctores').all();
    const todosPacientes = db.prepare('SELECT id FROM usuarios WHERE rol_id = ?').all(pacienteRol.id);
    
    if (todosDoctores.length > 0 && todosPacientes.length > 0) {
      const servicios = db.prepare('SELECT id FROM servicios LIMIT 3').all();
      const estados = ['Programada', 'Completada', 'Cancelada'];
      
      // Crear 10 citas adicionales distribuidas en los próximos 7 días
      for (let i = 0; i < 10; i++) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + Math.floor(Math.random() * 7));
        const hora = `${9 + Math.floor(Math.random() * 8)}:${Math.random() > 0.5 ? '00' : '30'}`;
        const doctor = todosDoctores[Math.floor(Math.random() * todosDoctores.length)];
        const paciente = todosPacientes[Math.floor(Math.random() * todosPacientes.length)];
        const estado = estados[Math.floor(Math.random() * estados.length)];
        const nota = `Cita ${i + 1} - ${estado}`;
        
        db.prepare(`
          INSERT INTO citas (paciente_id, doctor_id, fecha, hora, estado, nota)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(paciente.id, doctor.id, fecha.toISOString().split('T')[0], hora, estado, nota);
      }
    }
  }

  console.log('✅ Base de datos inicializada correctamente');
  console.log('📊 Datos de prueba insertados en todas las tablas');
};

// Inicializar base de datos
initDatabase();

export default db;

