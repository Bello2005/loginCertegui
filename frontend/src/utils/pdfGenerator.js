import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

/**
 * Genera un PDF con los datos de una tabla
 * @param {Array} data - Array de objetos con los datos
 * @param {Array} columns - Array con las columnas {header: 'Nombre', dataKey: 'nombre'}
 * @param {String} title - Título del reporte
 * @param {String} filename - Nombre del archivo PDF
 */
export const generateTablePDF = (data, columns, title, filename = 'reporte.pdf') => {
  const doc = new jsPDF();
  
  // Configuración de colores
  const primaryColor = [99, 102, 241]; // indigo-600
  const secondaryColor = [139, 92, 246]; // purple-600
  
  // Título del documento
  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.text(title, 14, 20);
  
  // Fecha de generación
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const fecha = new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generado el: ${fecha}`, 14, 28);
  
  // Preparar datos para la tabla
  const tableData = data.map(item => 
    columns.map(col => {
      // Intentar dataKey principal, luego alternativo
      let value = item[col.dataKey];
      if ((value === null || value === undefined) && col.dataKeyAlt) {
        value = item[col.dataKeyAlt];
      }
      // Formatear valores especiales
      if (value === null || value === undefined) return '-';
      if (typeof value === 'boolean') return value ? 'Sí' : 'No';
      if (typeof value === 'object') return JSON.stringify(value);
      // Formatear precios
      if (col.dataKey === 'precio' && typeof value === 'number') {
        return `$${value.toFixed(2)}`;
      }
      return String(value);
    })
  );
  
  // Preparar headers
  const headers = columns.map(col => col.header);
  
  // Generar tabla usando autoTable como función
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 35,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { top: 35, left: 14, right: 14 },
    tableWidth: 'auto',
    columnStyles: columns.reduce((acc, col, index) => {
      acc[index] = {
        cellWidth: col.width || 'auto',
        halign: col.align || 'left',
      };
      return acc;
    }, {}),
  });
  
  // Pie de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount} - Ortho&Mas`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Guardar PDF
  doc.save(filename);
};

/**
 * Genera un PDF de pacientes
 */
export const generatePacientesPDF = (pacientes) => {
  const columns = [
    { header: 'ID', dataKey: 'id', width: 20, align: 'center' },
    { header: 'Nombre', dataKey: 'nombre', width: 80 },
    { header: 'Correo', dataKey: 'correo', width: 100 },
    { header: 'Última Cita', dataKey: 'fecha', width: 60 },
  ];
  
  generateTablePDF(
    pacientes,
    columns,
    'Reporte de Pacientes',
    `pacientes_${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Genera un PDF de doctores
 */
export const generateDoctoresPDF = (doctores) => {
  const columns = [
    { header: 'ID', dataKey: 'id', width: 20, align: 'center' },
    { header: 'Nombre', dataKey: 'nombre', width: 100 },
    { header: 'Correo', dataKey: 'correo', width: 100 },
    { header: 'Especialidad', dataKey: 'especialidad', width: 80 },
  ];
  
  generateTablePDF(
    doctores,
    columns,
    'Reporte de Doctores',
    `doctores_${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Genera un PDF de tratamientos
 */
export const generateTratamientosPDF = (tratamientos) => {
  const columns = [
    { header: 'ID', dataKey: 'id', width: 20, align: 'center' },
    { header: 'Nombre', dataKey: 'nombre', width: 100 },
    { header: 'Descripción', dataKey: 'descripcion', width: 120 },
    { header: 'Precio ($)', dataKey: 'precio', width: 60, align: 'right' },
    { header: 'Duración (min)', dataKey: 'duracion_minutos', width: 50, align: 'center' },
  ];
  
  generateTablePDF(
    tratamientos,
    columns,
    'Reporte de Tratamientos',
    `tratamientos_${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Genera un PDF de citas
 */
export const generateCitasPDF = (citas) => {
  const columns = [
    { header: 'ID', dataKey: 'cita_id', dataKeyAlt: 'id', width: 20, align: 'center' },
    { header: 'Paciente', dataKey: 'paciente', width: 100 },
    { header: 'Doctor', dataKey: 'doctor', width: 100 },
    { header: 'Servicio', dataKey: 'servicio', width: 100 },
    { header: 'Fecha', dataKey: 'fecha', width: 60 },
    { header: 'Hora', dataKey: 'hora', width: 40 },
    { header: 'Estado', dataKey: 'estado', width: 60 },
  ];
  
  // Ajustar dataKey si no existe
  const citasFormatted = citas.map(cita => ({
    ...cita,
    cita_id: cita.cita_id || cita.id,
  }));
  
  generateTablePDF(
    citasFormatted,
    columns,
    'Reporte de Próximas Citas',
    `citas_${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Genera un PDF de inventario
 */
export const generateInventarioPDF = (inventario) => {
  const columns = [
    { header: 'ID', dataKey: 'id', width: 20, align: 'center' },
    { header: 'Material', dataKey: 'material_nombre', dataKeyAlt: 'material', width: 100 },
    { header: 'Proveedor', dataKey: 'proveedor_nombre', dataKeyAlt: 'proveedor', width: 100 },
    { header: 'Cantidad', dataKey: 'cantidad', width: 50, align: 'center' },
    { header: 'Cantidad Mínima', dataKey: 'cantidad_minima', width: 60, align: 'center' },
    { header: 'Ubicación', dataKey: 'ubicacion', width: 80 },
  ];
  
  generateTablePDF(
    inventario,
    columns,
    'Reporte de Inventario',
    `inventario_${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Genera un PDF de historia clínica completa del paciente
 */
export const generateHistoriaClinicaPDF = (pacienteData, citas, notas = []) => {
  const doc = new jsPDF();
  
  // Configuración de colores
  const primaryColor = [99, 102, 241]; // indigo-600
  const secondaryColor = [139, 92, 246]; // purple-600
  
  let yPosition = 20;
  
  // Título principal
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text('HISTORIA CLÍNICA', 105, yPosition, { align: 'center' });
  yPosition += 10;
  
  // Línea decorativa
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 8;
  
  // Información del paciente
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('INFORMACIÓN DEL PACIENTE', 20, yPosition);
  yPosition += 8;
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Nombre: ${pacienteData.nombre} ${pacienteData.apellido}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Correo: ${pacienteData.correo}`, 20, yPosition);
  yPosition += 6;
  doc.text(`ID de Paciente: ${pacienteData.id}`, 20, yPosition);
  yPosition += 10;
  
  // Fecha de generación
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const fecha = new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Documento generado el: ${fecha}`, 20, yPosition);
  yPosition += 12;
  
  // Historial de Citas
  if (citas && citas.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text('HISTORIAL DE CITAS', 20, yPosition);
    yPosition += 8;
    
    const citasData = citas.map(cita => [
      cita.fecha || cita.fechaHora?.split('T')[0] || '-',
      cita.hora || cita.fechaHora?.split('T')[1]?.substring(0, 5) || '-',
      cita.doctor_nombre ? `${cita.doctor_nombre} ${cita.doctor_apellido || ''}`.trim() : cita.doctor || 'N/A',
      cita.servicio || cita.nombre || 'Consulta',
      cita.estado || 'N/A'
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Fecha', 'Hora', 'Doctor', 'Servicio', 'Estado']],
      body: citasData,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { top: yPosition, left: 20, right: 20 },
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text('No hay citas registradas en el historial.', 20, yPosition);
    yPosition += 10;
  }
  
  // Notas Médicas
  if (notas && notas.length > 0) {
    // Nueva página si es necesario
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text('NOTAS MÉDICAS', 20, yPosition);
    yPosition += 8;
    
    const notasData = notas.map(nota => [
      nota.fecha || nota.created_at?.split('T')[0] || '-',
      nota.titulo || 'Sin título',
      nota.contenido?.substring(0, 50) + (nota.contenido?.length > 50 ? '...' : '') || 'Sin contenido',
      nota.doctor_nombre || 'N/A'
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Fecha', 'Título', 'Contenido', 'Doctor']],
      body: notasData,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { top: yPosition, left: 20, right: 20 },
      columnStyles: {
        2: { cellWidth: 80 } // Columna de contenido más ancha
      }
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
  }
  
  // Pie de página en todas las páginas
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount} - Ortho&Mas - Historia Clínica`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Guardar PDF
  const filename = `historia_clinica_${pacienteData.nombre}_${pacienteData.apellido}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

