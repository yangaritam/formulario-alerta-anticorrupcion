/**
 * CREAR FORMULARIO EN GOOGLE FORMS
 * "Registro de Alerta — Sistema de Integridad Anticorrupción"
 *
 * INSTRUCCIONES:
 * 1. Ve a https://script.google.com y crea un "Proyecto nuevo".
 * 2. Borra el contenido de Code.gs y pega TODO este archivo.
 * 3. Arriba, en el menú de funciones, selecciona "crearFormulario" y presiona ▶ Ejecutar.
 * 4. La primera vez Google pedirá autorización: acepta los permisos de tu propia cuenta.
 * 5. Cuando termine, abre la pestaña "Registro de ejecuciones" (o Ver > Registros)
 *    y ahí verás el enlace del formulario y el enlace de edición.
 * 6. También puedes buscar el formulario nuevo directamente en https://forms.google.com
 */

function crearFormulario() {
  const form = FormApp.create('Registro de Alerta — Sistema de Integridad Anticorrupción');
  form.setDescription(
    'Diligencie este formulario para reportar una alerta de posible irregularidad o corrupción. ' +
    'Los campos marcados como obligatorios deben completarse siempre.'
  );
  form.setCollectEmail(false);
  form.setAllowResponseEdits(true);

  // ------------------------------------------------------------------
  // PORTADA: Denuncia anónima
  // ------------------------------------------------------------------
  const anonima = form.addMultipleChoiceItem();
  anonima.setTitle('¿Desea presentar esta alerta de forma anónima?')
    .setHelpText('Si selecciona "Sí", no se le solicitarán sus datos como responsable de carga.')
    .setChoices([
      anonima.createChoice('Sí, deseo que sea anónima'),
      anonima.createChoice('No, puedo identificarme como responsable de carga')
    ])
    .setRequired(true);

  // ------------------------------------------------------------------
  // SECCIÓN 1: Identificación y responsables
  // ------------------------------------------------------------------
  form.addPageBreakItem().setTitle('1. Identificación y responsables');

  form.addDateItem().setTitle('Fecha de carga').setRequired(true);
  form.addDateItem().setTitle('Fecha del hecho')
    .setHelpText('Si se desconoce la fecha exacta, reporte la fecha en la que se encontró o detectó la irregularidad.')
    .setRequired(true);

  const estado = form.addListItem();
  estado.setTitle('Estado del registro').setChoiceValues(['Borrador', 'En revisión', 'Enviado']);

  form.addTextItem().setTitle('Responsable de carga (nombre y cargo)')
    .setHelpText('Deje en blanco si eligió reportar de forma anónima.');

  // ------------------------------------------------------------------
  // SECCIÓN 2: Sector y entidad
  // ------------------------------------------------------------------
  form.addPageBreakItem().setTitle('2. Sector y entidad — Datos abiertos PGN');

  const sector = form.addListItem();
  sector.setTitle('Sector').setRequired(true).setChoiceValues([
    'Ambiente y Desarrollo Sostenible',
    'Salud y Protección Social',
    'Educación',
    'Hacienda y Crédito Público',
    'Infraestructura y Transporte',
    'Interior',
    'Trabajo',
    'Otro'
  ]);

  form.addTextItem().setTitle('Entidad').setRequired(true)
    .setHelpText('Escriba el nombre completo de la entidad.');

  form.addTextItem().setTitle('Entidades secundarias / relacionadas')
    .setHelpText('Si aplica, liste otras entidades vinculadas al hecho, separadas por comas.');

  form.addTextItem().setTitle('Dependencia o área específica')
    .setHelpText('Ej: Oficina de Contratación, Subdirección Financiera...');

  // ------------------------------------------------------------------
  // SECCIÓN 3: Categoría de la alerta (con ramificación)
  // ------------------------------------------------------------------
  const pageCategoria = form.addPageBreakItem().setTitle('3. Categoría de la alerta');

  const categoria = form.addMultipleChoiceItem();
  categoria.setTitle('Seleccione la categoría de la alerta').setRequired(true);

  // Páginas de sub-tipo (una por categoría)
  const pageContratacion = form.addPageBreakItem().setTitle('3.1 Sub-tipo — Contratación');
  const subContratacion = form.addCheckboxItem();
  subContratacion.setTitle('Sub-tipo de Contratación').setChoiceValues([
    'Contratos OPS inusuales',
    'Contratos de alto valor',
    'Período Ley de Garantías',
    'Proceso contractual en curso',
    'Contratación de convenios interadministrativos',
    'Elefante Blanco',
    'Otro (especificar en observaciones)'
  ]);
  form.addTextItem().setTitle('Enlace(s) del contrato en SECOP')
    .setHelpText('Pegue el/los enlaces del contrato, separados por comas.');

  const pagePresupuesto = form.addPageBreakItem().setTitle('3.2 Sub-tipo — Modificaciones Presupuestales');
  const subPresupuesto = form.addCheckboxItem();
  subPresupuesto.setTitle('Sub-tipo de Modificaciones Presupuestales').setChoiceValues([
    'Traslado presupuestal',
    'Adición presupuestal',
    'Ejecución acelerada',
    'Compromiso de vigencias futuras',
    'Otro (especificar en observaciones)'
  ]);

  const pageDenuncia = form.addPageBreakItem().setTitle('3.3 Sub-tipo — Denuncia Ciudadana y Medios');
  const subDenuncia = form.addCheckboxItem();
  subDenuncia.setTitle('Sub-tipo de Denuncia Ciudadana y Medios').setChoiceValues([
    'Denuncia ciudadana directa',
    'Informante / veeduría',
    'Publicación en medios',
    'Otro (especificar en observaciones)'
  ]);

  const pagePersonal = form.addPageBreakItem().setTitle('3.4 Sub-tipo — Personal');
  const subPersonal = form.addCheckboxItem();
  subPersonal.setTitle('Sub-tipo de Personal').setChoiceValues([
    'Provisionalidad',
    'Requisitos',
    'Modificación planta',
    'Acoso laboral',
    'Acoso sexual',
    'Otro (especificar en observaciones)'
  ]);

  // Página común donde confluyen todas las ramas
  const pageFactores = form.addPageBreakItem().setTitle('Factores de riesgo de corrupción');
  form.addCheckboxItem().setTitle('Factores de riesgo de corrupción identificados').setChoiceValues([
    'Pérdida de recursos públicos (Desfalcos, sobrecostos)',
    'Desviación o manejo normativo contrario (Ilegalidad)',
    'Delitos / Hechos derivados de corrupción',
    'Riesgo inminente por cambios normativos de transición',
    'Riesgo de clientelismo, nombramientos masivos o amarre de cargos en la planta de personal'
  ]);

  // Configurar la ramificación: cada opción de categoría lleva a su página de sub-tipo,
  // y cada página de sub-tipo continúa hacia "Factores de riesgo".
  categoria.setChoices([
    categoria.createChoice('Contratación', pageContratacion),
    categoria.createChoice('Modificaciones Presupuestales', pagePresupuesto),
    categoria.createChoice('Denuncia Ciudadana y Medios', pageDenuncia),
    categoria.createChoice('Personal', pagePersonal)
  ]);
  pageContratacion.setGoToPage(pageFactores);
  pagePresupuesto.setGoToPage(pageFactores);
  pageDenuncia.setGoToPage(pageFactores);
  pagePersonal.setGoToPage(pageFactores);

  // ------------------------------------------------------------------
  // SECCIÓN 4: Fuente de información
  // ------------------------------------------------------------------
  form.addPageBreakItem().setTitle('4. Fuente de información');

  form.addListItem().setTitle('Origen de los datos').setRequired(true).setChoiceValues([
    'Línea anticorrupción',
    'Denuncia ciudadana',
    'Medios de comunicación',
    'Ente de control',
    'Informante interno',
    'Otro'
  ]);

  form.addMultipleChoiceItem()
    .setTitle('¿Fueron consultadas fuentes de datos públicos (SECOP, SIGEP, etc.) para validar esta información?')
    .setChoiceValues(['Sí', 'No']);

  // ------------------------------------------------------------------
  // SECCIÓN 5: Descripción de la alerta
  // ------------------------------------------------------------------
  form.addPageBreakItem().setTitle('5. Descripción de la alerta');

  form.addParagraphTextItem().setTitle('Descripción ejecutiva')
    .setHelpText('Titular noticioso o síntesis de la denuncia (máx. 500 caracteres).')
    .setRequired(true);

  form.addParagraphTextItem().setTitle('Hechos detallados (narración libre)');

  form.addParagraphTextItem().setTitle('Línea de tiempo cronológica')
    .setHelpText('Liste fechas y hechos relevantes, ej: "12/03/2026 – Firma del contrato".');

  form.addParagraphTextItem().setTitle('Links de medios / comunicados oficiales')
    .setHelpText('Pegue enlaces a noticias, comunicados o publicaciones oficiales que respalden la denuncia (uno por línea).');

  form.addParagraphTextItem().setTitle('Personas involucradas')
    .setHelpText('Nombre completo, cargo, y si es servidor público o particular. No incluya al denunciante. Una persona por línea.');

  form.addMultipleChoiceItem().setTitle('¿Hay alguna empresa/contratista involucrado?').setChoiceValues(['Sí', 'No']);

  form.addParagraphTextItem().setTitle('Datos de la empresa (si aplica)')
    .setHelpText('Razón social, NIT y representante legal.');

  form.addListItem().setTitle('Dato cuantitativo de la alerta').setChoiceValues([
    'Cuantía estimada en pesos (COP)',
    'Número de contratos involucrados',
    'Número de personas afectadas',
    'Sin dato cuantitativo'
  ]);

  form.addListItem().setTitle('¿Registra denuncias previas ante entes de control o judiciales?').setChoiceValues([
    'No registra denuncias previas',
    'Sí, ante la Procuraduría',
    'Sí, ante la Contraloría',
    'Sí, ante la Fiscalía',
    'Sí, ante otro ente'
  ]);

  // ------------------------------------------------------------------
  // SECCIÓN 6: Triage y criticidad
  // ------------------------------------------------------------------
  form.addPageBreakItem().setTitle('6. Triage y criticidad');

  form.addListItem().setTitle('Calificación de Triage').setChoiceValues([
    'Riesgo Crítico',
    'Riesgo Alto',
    'Riesgo Medio'
  ]);

  form.addCheckboxItem().setTitle('Tipo de incidencia').setChoiceValues([
    'Administrativa',
    'Disciplinaria',
    'Fiscal',
    'Penal'
  ]);

  // ------------------------------------------------------------------
  // SECCIÓN 7: Evidencia y carga de soportes
  // ------------------------------------------------------------------
  form.addPageBreakItem().setTitle('7. Evidencia y carga de soportes');

  // addFileUploadItem requiere que el formulario recolecte respuestas de usuarios con cuenta Google.
  try {
    form.addFileUploadItem().setTitle('Cargue archivos de soporte (PDF, XLSX, DOCX, PNG, MP3, JPG)')
      .setHelpText('Máx. 25MB por archivo.');
  } catch (e) {
    // Si falla (algunas cuentas/dominios restringen carga de archivos), se agrega alternativa en texto.
    form.addParagraphTextItem().setTitle('Enlaces a archivos de soporte')
      .setHelpText('Si no puede adjuntar archivos, pegue aquí enlaces a los documentos (Drive, etc.).');
  }

  form.addTextItem().setTitle('Enlace a carpeta en Google Drive')
    .setHelpText('Pegue el enlace compartido de la carpeta de Drive (recomendado nombrarla con un radicado consecutivo).')
    .setRequired(true);

  form.addTextItem().setTitle('Relación de alertas / vincular a macro-caso')
    .setHelpText('Si este caso forma parte de una denuncia conjunta o macro-caso existente, indíquelo aquí. Si no aplica, escriba "No vincular".');

  // ------------------------------------------------------------------
  // Log final con los enlaces
  // ------------------------------------------------------------------
  Logger.log('Formulario creado con éxito.');
  Logger.log('Enlace para RESPONDER (compártelo): ' + form.getPublishedUrl());
  Logger.log('Enlace para EDITAR (solo para ti): ' + form.getEditUrl());
  // ... (aquí va el resto de tu código anterior) ...
  form.addParagraphTextItem().setTitle('Hechos detallados (narración libre)');
  form.addParagraphTextItem().setTitle('Línea de tiempo cronológica')
    .setHelpText('Liste los hitos clave del hecho.');

  // ------------------------------------------------------------------
  // ¡NUEVO!: CÓDIGO PARA IMPRIMIR LOS ENLACES EN LA PANTALLA
  // ------------------------------------------------------------------
  Logger.log('=== ¡FORMULARIO CREADO CON ÉXITO! ===');
  Logger.log('1. ENLACE PARA EDITAR (Solo tú): ' + form.getEditUrl());
  Logger.log('2. ENLACE PARA RESPONDER (Público): ' + form.getPublishedUrl());
}

}
