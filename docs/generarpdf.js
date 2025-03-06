// Importar jsPDF desde el contexto global
const { jsPDF } = window.jspdf;

export async function generarPDF(formData, cotizacion, autoDealer) {
    if (typeof jsPDF === 'undefined') {
        console.error('Error: jsPDF no está disponible');
        return null;
    }
    
    const doc = new jsPDF();

    try {
        const now = new Date();
        const timestamp = now.getFullYear().toString().substr(-2) +
                          (now.getMonth() + 1).toString().padStart(2, '0') +
                          now.getDate().toString().padStart(2, '0') +
                          now.getHours().toString().padStart(2, '0') +
                          now.getMinutes().toString().padStart(2, '0');
        const placa = formData.placa.replace(/[^a-zA-Z0-9]/g, '');
        const cliente = formData.contratante.toUpperCase().replace(/[./()\s]+$/, '').replace(/[./()]/g, '');
        const fileName = `Qualitas Corp ${timestamp} ${placa} ${cliente}.pdf`;
    
        const doc = new jsPDF(); // Asegúrate de que jsPDF está correctamente inicializado
    
        // Configuración de márgenes y espaciados
        const marginLeft = 25;
        const marginRight = 25;
        const marginTop = 15;
        const marginBottom = 15;
    
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
    
        const contentWidth = pageWidth - marginLeft - marginRight;
    
        const lineHeight = doc.getTextDimensions('A').h * 1;
    
        const defaultEspacioAntes = 5;
        const defaultEspacioDespues = 5;
    
        // Configuración de colores y fuentes
        const colorTextoPrincipal = '#111827';
        const colorTextoSecundario = '#6B7280';
    
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
    
        // Ancho de las columnas para tablas
        const tableWidth = contentWidth;
        const columnWidths = [0.75 * tableWidth, 0.25 * tableWidth];
    
        // Posición vertical inicial
        let y = marginTop + 35;
    
        // Funciones auxiliares
    
        const addHeader = () => {
            doc.setTextColor(colorTextoPrincipal);
            doc.setFontSize(14);
            doc.text('Slip de Cotización Flotillas', marginLeft, marginTop + 15);
    
            const fechaCotizacion = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
            doc.setFontSize(10);
            doc.setTextColor(colorTextoSecundario);
            doc.text(`Cotización generada ${fechaCotizacion}`, marginLeft, marginTop + 22);
    
            const logoHeight = 15;
            const espacioEntreLogos = 5;
    
            const ratioLGFE = 1045 / 329;
            const ratioLQUE = 198 / 206;
    
            const logoWidthLGFE = logoHeight * ratioLGFE;
            const logoWidthLQUE = logoHeight * ratioLQUE;
    
            const posicionXSegundoLogo = pageWidth - marginRight - logoWidthLQUE;
            const posicionXPrimerLogo = posicionXSegundoLogo - logoWidthLGFE - espacioEntreLogos;
    
            doc.addImage('imgs/LGFE_DOC.png', 'PNG', posicionXPrimerLogo, marginTop, logoWidthLGFE, logoHeight);
            doc.addImage('imgs/LQUE_DOC.png', 'PNG', posicionXSegundoLogo, marginTop, logoWidthLQUE, logoHeight);
        };
    
        const addFooter = () => {
            doc.setFontSize(8);
            doc.setTextColor(colorTextoSecundario);
            doc.text('Este documento es una cotización y no constituye una póliza de seguro.', marginLeft, pageHeight - marginBottom - 5);
    
            doc.setFontSize(10);
            const pageInfo = `Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${doc.internal.getNumberOfPages()}`;
            doc.text(pageInfo, pageWidth - marginRight - doc.getTextWidth(pageInfo), pageHeight - marginBottom - 5);
        };
    
        const addPageBreak = () => {
            doc.addPage();
            addHeader();
            y = marginTop + 35;
        };
    
        const checkPageSpace = (additionalSpace = 0) => {
            if (y + additionalSpace > pageHeight - marginBottom - 30) {
                addPageBreak();
            }
        };
    
        const addSection = (title) => {
            checkPageSpace();
            doc.setTextColor(colorTextoPrincipal);
            doc.setFontSize(12);
            const lines = doc.splitTextToSize(title, contentWidth);
            lines.forEach(line => {
                doc.text(line, marginLeft, y);
                y += lineHeight;
            });
        };
    
        const addSectionBold = (title, espacioAntes = defaultEspacioAntes, espacioDespues = defaultEspacioDespues) => {
            if (espacioAntes) {
                y += espacioAntes;
            }
            checkPageSpace();
            doc.setTextColor(colorTextoPrincipal);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            const lines = doc.splitTextToSize(title, contentWidth);
            lines.forEach(line => {
                doc.text(line, marginLeft, y);
                y += lineHeight;
            });
            doc.setFont('helvetica', 'normal');
            if (espacioDespues) {
                y += espacioDespues;
            }
        };
    
        const addParagraph = (text, espacioAntes = defaultEspacioAntes, espacioDespues = defaultEspacioDespues) => {
            if (espacioAntes) {
                y += espacioAntes;
            }
            checkPageSpace();
            doc.setFontSize(10);
            doc.setTextColor(colorTextoPrincipal);
            const lines = doc.splitTextToSize(text, contentWidth);
            lines.forEach(line => {
                checkPageSpace();
                doc.text(line, marginLeft, y);
                y += lineHeight;
            });
            if (espacioDespues) {
                y += espacioDespues;
            }
        };
    
        const addParagraphList = (items, espacioAntes = defaultEspacioAntes, espacioDespues = defaultEspacioDespues) => {
            if (espacioAntes) {
                y += espacioAntes;
            }
            doc.setFontSize(10);
            doc.setTextColor(colorTextoPrincipal);
            const bulletIndent = 10;
            items.forEach(item => {
                checkPageSpace();
                // Restablecer el color después de cada salto de página
                doc.setTextColor(colorTextoPrincipal);
                const text = `- ${item}`;
                const lines = doc.splitTextToSize(text, contentWidth - bulletIndent);
                lines.forEach((line, lineIndex) => {
                    checkPageSpace();
                    // Restablecer el color después de cada salto de página
                    doc.setTextColor(colorTextoPrincipal);
                    const offset = bulletIndent + (lineIndex > 0 ? 0 : 0);
                    doc.text(line, marginLeft + offset, y);
                    y += lineHeight;
                });
            });
            if (espacioDespues) {
                y += espacioDespues;
            }
        };
        
        const addParagraphNumbers = (items, inicio = 1, espacioAntes = defaultEspacioAntes, espacioDespues = defaultEspacioDespues) => {
            if (espacioAntes) {
                y += espacioAntes;
            }
            doc.setFontSize(10);
            doc.setTextColor(colorTextoPrincipal);
            const numberIndent = 10;
            items.forEach((item, index) => {
                checkPageSpace();
                // Restablecer el color después de cada salto de página
                doc.setTextColor(colorTextoPrincipal);
                const itemNumber = inicio + index;
                const text = `${itemNumber}. ${item}`;
                const lines = doc.splitTextToSize(text, contentWidth - numberIndent - 10);
                lines.forEach((line, lineIndex) => {
                    checkPageSpace();
                    // Restablecer el color después de cada salto de página
                    doc.setTextColor(colorTextoPrincipal);
                    const offset = numberIndent + (lineIndex > 0 ? 0 : 0);
                    doc.text(line, marginLeft + offset, y);
                    y += lineHeight;
                });
            });
            if (espacioDespues) {
                y += espacioDespues;
            }
        };
    
        const addRow = (label, value) => {
            checkPageSpace();
            doc.setTextColor(colorTextoPrincipal);
            doc.setFontSize(10);
            doc.text(label, marginLeft, y);
            doc.setTextColor(colorTextoSecundario);
            doc.text(value, marginLeft + 70, y);
            y += lineHeight;
        };
    
        const addTwoColumnTableRow = (text1, text2, isHeader = false) => {
            const cellPadding = 2;
            const textOptions1 = { maxWidth: columnWidths[0] - 2 * cellPadding };
            const textOptions2 = { maxWidth: columnWidths[1] - 2 * cellPadding };
            const textHeight1 = doc.getTextDimensions(text1, textOptions1).h;
            const textHeight2 = doc.getTextDimensions(text2, textOptions2).h;
            const rowHeight = Math.max(textHeight1, textHeight2) + 2 * cellPadding;
    
            checkPageSpace(rowHeight);
    
            doc.setFillColor(isHeader ? '#f3f4f6' : '#ffffff');
            doc.rect(marginLeft, y, columnWidths[0], rowHeight, 'FD');
            doc.rect(marginLeft + columnWidths[0], y, columnWidths[1], rowHeight, 'FD');
    
            doc.setTextColor(colorTextoPrincipal);
            doc.setFontSize(isHeader ? 11 : 10);
    
            doc.text(text1.trim(), marginLeft + cellPadding, y + cellPadding + doc.getTextDimensions(text1.trim()).h, textOptions1);
            doc.text(text2.trim(), marginLeft + columnWidths[0] + cellPadding, y + cellPadding + doc.getTextDimensions(text2.trim()).h, textOptions2);
    
            y += rowHeight;
        };
    
        const addTwoColumnTableRowInverse = (text1, text2, isHeader = false) => {
            const cellPadding = 2;
            const columnWidthsInverse = [0.25 * tableWidth, 0.75 * tableWidth];
            const textOptions1 = { maxWidth: columnWidthsInverse[0] - 2 * cellPadding };
            const textOptions2 = { maxWidth: columnWidthsInverse[1] - 2 * cellPadding };
            const textHeight1 = doc.getTextDimensions(text1, textOptions1).h;
            const textHeight2 = doc.getTextDimensions(text2, textOptions2).h;
            const rowHeight = Math.max(textHeight1, textHeight2) + 2 * cellPadding;
    
            checkPageSpace(rowHeight);
    
            doc.setFillColor(isHeader ? '#f3f4f6' : '#ffffff');
            doc.setDrawColor(255, 255, 255); // Borde invisible
    
            doc.rect(marginLeft, y, columnWidthsInverse[0], rowHeight, 'FD');
            doc.rect(marginLeft + columnWidthsInverse[0], y, columnWidthsInverse[1], rowHeight, 'FD');
    
            doc.setTextColor(colorTextoPrincipal);
            doc.setFontSize(isHeader ? 11 : 10);
    
            doc.text(text1.trim(), marginLeft + cellPadding, y + cellPadding + doc.getTextDimensions(text1.trim()).h, textOptions1);
            doc.text(text2.trim(), marginLeft + columnWidthsInverse[0] + cellPadding, y + cellPadding + doc.getTextDimensions(text2.trim()).h, textOptions2);
    
            y += rowHeight;
        };
    
        const addSingleColumnTableRow = (text, isHeader = false) => {
            const cellPadding = 2;
            const textOptions = { maxWidth: tableWidth - 2 * cellPadding };
            const textHeight = doc.getTextDimensions(text, textOptions).h;
            const rowHeight = textHeight + 2 * cellPadding;
    
            checkPageSpace(rowHeight);
    
            doc.setFillColor(isHeader ? '#f3f4f6' : '#ffffff');
            doc.rect(marginLeft, y, tableWidth, rowHeight, 'FD');
    
            doc.setTextColor(colorTextoPrincipal);
            doc.setFontSize(isHeader ? 11 : 10);
            doc.text(text.trim(), marginLeft + cellPadding, y + cellPadding + doc.getTextDimensions(text.trim()).h, textOptions);
    
            y += rowHeight;
        };
    
        // Comenzar a agregar contenido
        addHeader();
                

        addSectionBold('Información General',true);
        addRow('CONTRATANTE/ASEGURADO', formData.contratante);
        addRow('DNI/RUC', formData.dni_ruc);
        addRow('CORREDOR', 'GF CONSULTOR CORREDORES DE SEGUROS');
        addRow('PERÍODO', '365 días');
        addRow('MONEDA', 'US$ dólares americanos');
        addRow('FOLIO SUSCRIPCIÓN', '-');

        addSectionBold('Información del Vehículo',true);
        addRow('USO', 'PARTICULAR');
        addRow('CIRCULACIÓN', formData.circulacion);
        addRow('CLASE / TIPO', formData.claseTipoList);
        addRow('PLACA', formData.placa);
        addRow('MARCA', formData.marca);
        addRow('MODELO', formData.modelo);
        addRow('AÑO', formData.ano);

        addSectionBold('Detalles de la Cotización',true);
        addRow('SUMA ASEGURADA', formData.sumaAsegurada.toLocaleString('es-PE', { style: 'currency', currency: 'USD' }));
        addRow('AUTOALDEALER', autoDealer ? 90.00.toLocaleString('es-PE', { style: 'currency', currency: 'USD' }) : '-');
        addRow('PRIMA NETA', cotizacion.primaNeta.toLocaleString('es-PE', { style: 'currency', currency: 'USD' }));
        addRow('PRIMA TOTAL', cotizacion.primaTotal.toLocaleString('es-PE', { style: 'currency', currency: 'USD' }));

        addPageBreak();

        addSectionBold('MATERIA DEL SEGURO');
        addParagraph('Vehículos livianos de uso particular.',-5,0);

        addTwoColumnTableRow('Coberturas para Todo Riesgo de Automóviles', 'Suma Asegurada', true);
        addTwoColumnTableRow('Daños Materiales / Robo, Hurto o Uso, No Autorizado (Choque, Vuelco, Incendio, Robo Total, Robo Parcial y Rotura de Lunas)\n- Riesgos de la Naturaleza\n- Riesgos Políticos','US$ 200,000.00');
        addTwoColumnTableRow('Responsabilidad Civil Frente Ocupantes (*), Hasta En todos los casos se excluye el chofer', 'Limite Por Vehículo US$ 100,000.00\nMáximo por ocupante US$ 25,000.00');
        addTwoColumnTableRow('Accesorios Musicales y Equipos audiovisuales: Sin exceder el 10% del valor asegurado, hasta', 'US$ 2,000.00');
        addTwoColumnTableRow('Accesorios Especiales adaptados y fijos en la unidad: Sin exceder el 10% del valor asegurado, hasta', 'US$ 2,000.00');
        addTwoColumnTableRow('Equipo electrónico, para los componentes electrónicos con los que cuenten las unidades aseguradas, que se encuentren adaptadas y fijas al vehículo. Sin exceder el 15% de la Suma Asegurada, hasta', 'US$ 3,000.00');
        addTwoColumnTableRow('Accidentes Personales (máximo 5 ocupantes) (**):', '');
        addTwoColumnTableRow('- Muerte e invalidez permanente c/u hasta', 'US$ 30,000.00');
        addTwoColumnTableRow('- Gastos de curación c/u hasta', 'US$ 6,000.00');
        addTwoColumnTableRow('- Gastos de sepelio c/u hasta', 'US$ 2,000.00');
        addTwoColumnTableRow('- Cirugía Estética c/u hasta', 'US$ 1,500.00');
        addTwoColumnTableRow('Ausencia de Control / Imprudencia Temeraria - Daño Propio', 'Suma Asegurada');
        addTwoColumnTableRow('Ausencia de Control / Imprudencia Temeraria - Responsabilidad Civil', 'US$ 100,000.00');
        addTwoColumnTableRow('Asistencia en viaje (***)\n- Servicio de Grúa, hasta\n- Servicio de Ambulancia, hasta\n- Auxilio Mecánico, hasta','\n\nUS$ 1,000.00\nUS$ 1,000.00\nUS$ 700.00');
        addTwoColumnTableRow('Defensa Judicial, hasta', 'US$ 2,700.00');
        addTwoColumnTableRow('Gastos de rescate y/o búsqueda de la unidad, hasta', 'US$ 3,000.00');
        addTwoColumnTableRow('Vehículo de Reemplazo, (Por Robo 30d/ por choque 15d), Solo para vehículos livianos de uso particular', 'Amparado');
        addTwoColumnTableRow('Chofer de Reemplazo, Solo para vehículos livianos de uso particular', '5 eventos');

        addParagraph('(*) Por Vehículo / Por evento\n(**) Automóviles, SUV y Pick Ups, hasta 5 ocupantes Vehículos pesados, panel, hasta 2 ocupantes Microbuses, Minibuses y Ómnibus, hasta 2 ocupantes\n(***) Servicio de Grúa y Ambulancia, hasta 4 eventos al año, máximo 2 eventos al mes. Eventos de Auxilio mecánico, ilimitados.');

        addSectionBold('DEDUCIBLES (No incluyen IGV)',true);

        addSingleColumnTableRow('Automóviles y Camionetas SUV - Particular', true);
        addSingleColumnTableRow('- Por evento 10% del monto indemnizable, mínimo US$ 150 en Talleres Qualificados Multimarca');
        addSingleColumnTableRow('- Por evento 15% del monto indemnizable, mínimo US$ 150 en Talleres Concesionarios Afiliados (NO APLICA ninguna modificación a lo establecido en vehículos Chinos ni para Híbridos.)');
        addSingleColumnTableRow('- Vehículos híbridos: 20% del monto indemnizable, mínimo US$ 300.00. Aplica para la reparación a los componentes del sistema eléctrico del vehículo.');
        addSingleColumnTableRow('Excepto:');
        addSingleColumnTableRow('- Pérdida Total: Sin Deducible (****)\n- Con excepción de los eventos por Ausencia de Control donde aplicara el deducible correspondiente.');
        addSingleColumnTableRow('- Responsabilidad Civil frente a terceros y Responsabilidad a Ocupantes 10% del monto indemnizable, mínimo US$ 150.00');
        addSingleColumnTableRow('- Accesorios Musicales y Especiales: 10% del monto indemnizable, mínimo US$ 150.00');
        addSingleColumnTableRow('- Equipo electrónico: 15% del monto indemnizable, mínimo US$ 200.00');
        addSingleColumnTableRow('- Ausencia de Control y RC por AC: 20% del monto del siniestro, mínimo US$ 300.00');
        addSingleColumnTableRow('- Robo de Accesorios: 10% del monto indemnizable, mínimo US$ 150.00');
        addSingleColumnTableRow('- Rotura de Lunas Nacionales: Sin deducible');
        addSingleColumnTableRow('- Rotura de Lunas Importadas: 10% del monto indemnizable, mínimo US$ 150.00');
        addSingleColumnTableRow('- Robo Total: Sin Deducible.(****)\n- Vehículos con obligatoriedad de contar con dispositivo GPS y no lo tengan habilitado y operativo al momento de un evento, no contaran con cobertura de Robo Total.');
        addSingleColumnTableRow('- Accidentes Personales: Sin deducible');
        addSingleColumnTableRow('- Circulación en vías fuera del uso regular y frecuente: Uso de vías no autorizadas: 20% del monto indemnizable, mínimo US$ 300.00');
        addSingleColumnTableRow('- Vehículo de Reemplazo: Copago: US$ 90.00 más IGV');

        addParagraph('(****) Con excepción del modelo Soluto de la marca Kia al que se aplica deducible de 20% del monto indemnizable.');

        addSingleColumnTableRow('Automóviles y Camionetas SUV de Origen Chino / Indio - Particular',true);
        addSingleColumnTableRow('- Por evento 15% del monto indemnizable, mínimo US$ 150 en Talleres Qualificados Multimarca');
        addSingleColumnTableRow('- Por evento 20% del monto indemnizable, mínimo US$ 200 en Talleres Concesionarios Afiliados');
        addSingleColumnTableRow('- Vehículos híbridos: 25% del monto indemnizable, mínimo US$ 300.00. Aplica para la reparación a los componentes del sistema eléctrico del vehículo.');
        addSingleColumnTableRow('Excepto:');
        addSingleColumnTableRow('- Pérdida Total: Sin deducible.\nCon excepción de los eventos por Ausencia de Control donde aplicará el deducible correspondiente.');
        addSingleColumnTableRow('- Responsabilidad Civil frente a terceros y Responsabilidad a Ocupantes 15% del monto indemnizable, mínimo US$ 150.00');
        addSingleColumnTableRow('- Accesorios Musicales y Especiales: 10% del monto indemnizable, mínimo US$ 150.00');
        addSingleColumnTableRow('- Ausencia de Control y RC por AC: 25% del monto del siniestro, mínimo US$ 400.00');
        addSingleColumnTableRow('- Robo de Accesorios: 10% del monto indemnizable, mínimo US$ 150.00');
        addSingleColumnTableRow('- Rotura de Lunas Nacionales: Sin deducible');
        addSingleColumnTableRow('- Rotura de Lunas Importadas: 10% del monto indemnizable, mínimo US$ 150.00');
        addSingleColumnTableRow('- Robo Total: Sin deducible.\n- Vehículos con obligatoriedad de contar con dispositivo GPS y no lo tengan habilitado y operativo al momento de un evento, no contarán con cobertura de Robo Total.');
        addSingleColumnTableRow('- Accidentes Personales: Sin deducible');
        addSingleColumnTableRow('- Circulación en vías fuera del uso regular y frecuente: Uso de vías no autorizadas: 25% del monto indemnizable, mínimo US$ 400.00');
        addSingleColumnTableRow('- Vehículo de Reemplazo: Copago: US$ 90.00 más IGV');

        addPageBreak();

        addSectionBold('COBERTURAS APLICABLES:');
        addParagraph('Colisión, Incendio, Rotura accidental de Lunas, Fenómenos naturales, incluyendo maremoto, tsunami y marejada, así como los daños provenientes de inundaciones causadas por lluvias que originen crecidas de ríos, desborde de acequias, lagos y lagunas, deslizamientos de tierra (huaicos), Huelga, conmoción civil, daño malicioso, vandalismo y terrorismo.',0,5);

        addSectionBold('Daños Materiales',true);
        addParagraph('Robo o hurto total del vehículo asegurado, hasta el valor indicado en las condiciones particulares.\nEl robo o hurto de piezas o partes del vehículo asegurado, hasta el límite establecido en las Condiciones Particulares de la póliza.\nLos daños causados por la perpetración de delitos, en cualquiera de sus grados, de consumado, frustrado o tentativa.',0,5);

        addSectionBold('Responsabilidad Civil Frente a Terceros',true);
        addParagraph('Hasta el límite indicado en el cuadro Detalle de Coberturas. La presente cobertura cubre los riesgos de daño emergente, lucro cesante, daño moral, para accidentes personales ocasionados a terceros no ocupantes, aplicará en exceso a la cobertura de SOAT.',0,5);

        addSectionBold('Responsabilidad Civil Frente a Ocupantes',true);
        addParagraph('Lesiones corporales que sufran las personas que viajen dentro del vehículo asegurado, excepto conductor, chóferes y/o familiares.\nLa presente cobertura es aplicable con un límite máximo por ocupante, según lo indicado en el cuadro Detalle de Coberturas.',0,5);

        addSectionBold('Accidentes Personales',true);
        addParagraph('El presente apartado comprende las siguientes sub-coberturas:',0,0);
        addParagraphList(['Muerte e Invalidez permanente','Gastos de curación','Gastos de Sepelio'])
        addParagraph('La suma máxima por ocupante se especifica en el cuadro Detalle de Coberturas, considerando un límite de ocupantes, según lo señalado en la tarjeta de propiedad del vehículo.',0,5);

        addSectionBold('Defensa Judicial',true);
        addParagraph('Ante una eventual Responsabilidad Civil como consecuencia de un accidente de tránsito, este Seguro se extiende a cubrir hasta el límite asegurado indicado en el cuadro Detalle de Coberturas, los gastos que se requieran para la correspondiente defensa judicial en las diligencias que deban realizarse.',0,5);

        addSectionBold('Asistencia en Viaje y/o Auxilio Mecánico',true);
        addParagraph('En caso de emergencia, se deberá comunicar con la central de asistencia al 622-2233. Ofrecemos grúa y ambulancia.\nEn caso de que la compañía se encuentre impedida de brindar el servicio, se reembolsará hasta el monto indicado en el cuadro Detalle de Coberturas.',0,5);

        addSectionBold('Ausencia de Control: Daños Materiales y Responsabilidad Civil frente a terceros',true);
        addParagraph('Ausencia de control hasta el valor asegurado del vehículo y Responsabilidad Civil por ausencia de control limitada al monto indicado en el cuadro Detalle de Coberturas.\nCubre eventos que se susciten en Vías No Autorizadas.',0,5);

        addSectionBold('Exclusiones',true);
        addParagraph('Se excluyen los daños ocasionados por la carga transportada (para el transporte de combustible y material inflamable, no se amparan pérdidas a consecuencia de incendio y/o explosión).',0,5);

        addSectionBold('ASPECTOS GENERALES DE SUSCRIPCIÓN',5,0);
        addParagraphList([
            'Las unidades sin placa de Rodaje se podrán emitir sólo si son unidades nuevas. Los datos de identificación necesarios son el número de motor y chasís.',
            'Los accesorios musicales o de comunicación que no se encuentren fijos en el vehículo no serán materia de cobertura.',
            'Los valores comerciales serán determinados en función a la lista de APESEG vigente al momento de la cotización. Se podrá evaluar con sustento en caso la suma asegurada solicitada se encuentre fuera del rango permitido.',
            'En caso la factura del proveedor contemple un descuento especial, la suma asegurada no considerará dicho descuento.',
            'Sólo se considerará condiciones de año cero a las unidades con año de fabricación correspondiente al año vigente (2024).'
        ]);

        addSectionBold('COBERTURAS ADICIONALES',5,0);
        addParagraphList([
            'Cobertura automática para nuevas adquisiciones. (Hasta por 30 días desde la fecha de adquisición)',
            'Restitución automática de la suma asegurada de daño propio, sin costo adicional. Para la cobertura de accesorios musicales se podrá restituir la suma asegurada hasta una vez en el año, pero con cobro adicional.',
            'Atención de siniestros en red de talleres afiliados a Qualitas Seguros.',
            'Uso de vías o rutas no autorizadas al tránsito bajo condiciones de las coberturas de Ausencia de control / Imprudencia Temeraria.'
        ]);

        addSectionBold('SERVICIOS ADICIONALES',5,0);
        addParagraphList([
            'Servicio de atención las 24 horas a través de la central de emergencias QUALITAS.',
            'Servicio de Auxilio Mecánico.',
            'Servicio de Grúa en caso de siniestro. Por reembolso hasta US$ 1,000.00 cuando el proveedor de la compañía no pueda brindar el servicio.',
            'Servicio de Ambulancia en caso de siniestro. Por reembolso hasta US$ 1,000.00 cuando el proveedor de la compañía no pueda brindar el servicio.',
            'Servicio de asistencia de procuraduría en caso de siniestro.',
            'Chofer reemplazo para vehículos livianos de uso particular.',
            'Vehículo de reemplazo en caso de siniestro: Cobertura de 15 días para casos de choque, vuelco, incendio, despiste y 30 días para casos de robo total. (Sujeto a disponibilidad de proveedores)',
            'Gastos de Búsqueda y Rescate por evento hasta US$ 3,000.00.',
            'Gastos Defensa Jurídica y Penal por evento hasta US$ 2,700.00.',
            'Se cubre el costo de reposición de llaves de los vehículos (incluyendo llaves electrónicas), a consecuencia de robo por asalto. Cobertura hasta US$ 1,000.00, un evento por vigencia.'
        ]);

        addSectionBold('CONDICIONES ESPECIALES',5,0);
        addParagraphNumbers([
            'Valor Admitido y/o Convenido: Las indemnizaciones en caso de pérdida total y/o robo total serán efectuadas sobre la base de la suma asegurada establecida en la póliza, la misma que no podrá superar el 120% del valor comercial que tenga una unidad de las mismas condiciones y características en el mercado nacional, a la fecha de indemnización del siniestro.',
            'Se deja constancia que la totalidad de las unidades incluidas en la póliza, están siendo aseguradas incluyendo el IGV, motivo por el cual las indemnizaciones en caso de siniestro de pérdida total y/o robo total, deberán efectuarse incluyendo dicho impuesto, para todos los asegurados, sin excepción alguna.',
            'La cobertura de daño propio se extiende inclusive para resarcir las pérdidas y/o daños que se produzcan mientras las unidades se encuentren siendo remolcadas y/o reparadas y/o en prueba en sus propios talleres y/o talleres de terceros a quienes el asegurado haya solicitado este servicio.',
            'Las pérdidas totales serán determinadas cuando los daños a la unidad siniestrada sean iguales o superen el 75% de la suma asegurada.',
            'Responsabilidad Civil frente a ocupantes y/o pasajeros, limitados por el número de ocupantes permitidos por la Tarjeta de Propiedad, excluyendo al conductor. Máximo el número de personas según tarjeta.',
            'Se declarará una pérdida total por robo, a los treinta (30) días transcurridos desde la fecha de ocurrencia del siniestro, en caso no aparezca el vehículo robado.',
            'El aire acondicionado, las bolsas de aire (Air bag), así como cualquier otro equipamiento de fábrica que posean los vehículos, se encuentran incluidos en el valor del vehículo, accesorios adicionales deberán ser declarados y su valor agregado a la suma asegurada.',
            'No se limitará la cobertura de robo parcial y/o total para las unidades que no cuenten con dispositivos de seguridad tales como: alarmas antirrobo, sistemas de trabagas, protectores de faros, tuercas y pernos y seguridad para aros y llantas.',
            'Exoneración de devolución de la carátula desmontable para equipos de música. Es decir, para tener la cobertura de robo no será necesario retirar la misma como medida de seguridad. Hasta 05 eventos.',
            'Se cubren las pérdidas y/o daños a las unidades aseguradas, en cualquier lugar en donde se encuentren estacionadas, incluyendo la cobertura de incendio a consecuencia de fuego externo. Se amparan los accidentes que sufran las unidades aseguradas por cualquier suceso que se origine por una fuerza externa, repentina y violenta que ocasione pérdida total o parcial.',
            'No se aplicará depreciación para la indemnización de llantas.',
            'En caso de siniestro y de no existir en el país las piezas de recambio (Repuestos originales), la compañía se encargará de obtener estas en el extranjero. Sólo en el caso de no existir en estos mercados, se procederá de acuerdo con las condiciones de la póliza.',
            'Exoneración de intervención policial en casos tales como; robos parciales, choques estacionados, choques y/o daños donde no haya involucrado daños a terceros, siempre y cuando exista la intervención y aprobación del procurador de la compañía; la procuraduría será las 24 horas del día, llamando al call center y en las zonas urbanas donde se cuente con el servicio. Este servicio también se encargará de coordinar la asistencia de grúa y/o remolque, ambulancia y del servicio de auxilio mecánico en caso sea necesario.',
            'En caso de siniestro, no se excluirán daños o pérdidas adicionales ocurridas al vehículo asegurado a consecuencia del abandono de la unidad por causas de fuerza mayor; tales como: cumplimiento de un deber de humanidad, salvaguardar la integridad del chofer, de ocupantes del vehículo y para cumplir con el trámite legal y/o policial.',
            'En el caso de rotura de lunas y cualquier otro siniestro que las afecte, se incluye en la cobertura las láminas de seguridad, anti-impacto y polarizadas y/o control solar, siempre y cuando hayan formado parte del vehículo.',
            'Al amparo de la Cláusula de “Uso de Vías No Autorizadas” y bajo las condiciones de Ausencia de Control, se extiende a cubrir siniestros que ocurran en cruce de riachuelos, caminos y carreteras internas en las minas.',
            'Se cubren los siniestros cuando la licencia de conducir del chofer se encuentre vencida, y se haya efectuado el trámite de renovación, y habiendo aprobado las evaluaciones, se encuentre pendiente de entrega del nuevo documento como máximo hasta 30 días posteriores al vencimiento.',
            'Plazo para denuncia de siniestros:\n\ta. A la Autoridad Policial, hasta 4 horas después de ocurrido cualquier siniestro.\n\tb. A la Compañía de Seguros, hasta 03 días después de ocurrido cualquier siniestro, siempre y cuando el asegurado haya realizado la denuncia policial y se haya sometido al dosaje etílico correspondiente en los plazos de ley.',
            'La cobertura de accidentes personales para ocupantes se activa por cualquier evento o accidente que se encuentre debidamente amparado por la cobertura de daño propio. Asimismo, las sumas aseguradas bajo las coberturas de accidentes personales serán iguales para todos los pasajeros de cualquier edad, sin ninguna limitación o reducción, o aplicación de porcentaje.',
            'Para la aplicación de la cláusula de Ausencia de Control o Imprudencia del Conductor:']);
            
        addParagraphList([
            'No se limita a radio urbano.',
            'Será de aplicación los 365 días del año las 24 horas del día aun cuando el siniestro no se produzca en el desempeño de las funciones autorizadas a los trabajadores.',
            'Conducir a una velocidad que exceda la permitida.',
            'Cuando el vehículo se encuentre conducido por el titular, cónyuge, sus hijos mayores de edad y/o terceras personas sin la autorización del asegurado siempre y cuando tengan la licencia de conducir vigente. La póliza se extiende a amparar los siniestros que se produzcan como consecuencia de que la unidad circule en sentido contrario al tránsito autorizado, incluyendo invasión de carril contrario, línea discontinua.',
            'No es necesario que el chofer se encuentre en la planilla del asegurado. Asimismo, se deja constancia que las unidades pueden ser conducidas por cualquier persona, trabajador, funcionario o cualquier persona contratada o no por el asegurado, aunque no se encuentren registrados en la planilla o no realicen las actividades de chofer.'],
            -5,-5);
            
        addParagraphNumbers([
            'No se aplicará deducible en los siguientes siniestros, siempre y cuando no cuente con deducible diferenciado en póliza:'],
            21
        );
        
        addParagraphList([
            'Daños Personales.',
            'Pérdida Total, excepto Ausencia de Control o imprudencia culposa del conductor, y en los deducibles que se especifiquen en las condiciones particulares.',
            'Rotura de lunas, cuando se reponga con luna nacional.'],
            -5,-5);

        addParagraph(
            '\tObligatoriedad de Instalación de GPS: Según política adjunta.',
            5,0);

        addPageBreak();

        addSectionBold('UNIDADES NO ASEGURABLES EN EL PRESENTE PROGRAMA - SUJETAS A EVALUACIÓN.');
        addSectionBold('Por Modelo:',0,0);

        addTwoColumnTableRowInverse('Audi', 'TT, TTS, R8 y RS3 en adelante');
        addTwoColumnTableRowInverse('BMW', 'Versiones Coupe y Gran Coupe, M3, M4, M5, M6, 840, 850, Serie Z');
        addTwoColumnTableRowInverse('Mazda', 'RX8, MX5');
        addTwoColumnTableRowInverse('Subaru', 'WRX (todas las versiones), BRZ (todas las versiones)');
        addTwoColumnTableRowInverse('Dodge', 'Challenger, Charger, Nitro');
        addTwoColumnTableRowInverse('Ford', 'Mustang');
        addTwoColumnTableRowInverse('Toyota', '86 GT');
        addTwoColumnTableRowInverse('Nissan', '350 Z');
        addTwoColumnTableRowInverse('Renault', 'Megane RS');
        addTwoColumnTableRowInverse('Mitsubishi', 'Lancer EVO');
        addTwoColumnTableRowInverse('Hyundai', 'Tiburón');
        addTwoColumnTableRowInverse('Mercedes Benz', '(Versiones AMG, SLK, SL, SLC todas con motor de 3.0 en adelante)');
        addTwoColumnTableRowInverse('Peugeot', 'RCZ');
        addTwoColumnTableRowInverse('Hummer', 'En todos sus modelos');
        addTwoColumnTableRowInverse('Aston Martin', 'En todos sus modelos');
        addTwoColumnTableRowInverse('Porsche', 'En todos sus modelos');
        addTwoColumnTableRowInverse('Maserati', 'En todos sus modelos');
        addTwoColumnTableRowInverse('Jaguar', 'En todos sus modelos');

        addSectionBold('Por Uso:',10,0);
        addParagraphList([
            'Cualquier uso distinto al PARTICULAR.',
            'En caso de encontrarse asegurada una unidad distinta al uso PARTICULAR, el siniestro será rechazado.'
        ]);

        addSectionBold('Por Estado De Conservación:',0,0);
        addParagraphList([
            'Unidades que no tengan buen estado de conservación según informe de inspección.',
            'Las versiones americanas o vehículos de importación directa podrán ser evaluados únicamente con la presentación del reporte AUTOCHECK, empresa estadounidense proveedora de historiales de vehículos de procedencia americana y de otros países.'
        ]);

        addSectionBold('Por Otras Características Especiales:',0,0);
        addParagraphList([
            'No se aseguran vehículos utilizados para carreras, competencias, demostración o vehículos que tengan jaula interna incorporada.',
            'No se aseguran vehículos que son convertibles o cabriolet.',
            'No se aseguran vehículos blindados. Excepciones a negociar.',
            'No se aseguran aquellos vehículos con modificaciones en el motor con el objetivo de aumentar la potencia y/o rendimiento del motor.'
        ]);


        for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
            doc.setPage(i);
            addFooter();
        }

        return {
            blob: doc.output('blob'),
            fileName: fileName
        };
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        return null;
    }
}
