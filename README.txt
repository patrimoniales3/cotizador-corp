
# Cotizador Corp Qualitas

![Qualitas Logo](https://via.placeholder.com/300x100?text=Qualitas+Logo)

Bienvenido a **Cotizador Corp Qualitas** – una herramienta de cotización de seguros diseñada para mejorar la eficiencia del flujo de trabajo, proporcionando una experiencia intuitiva y fácil de usar. Este README ofrece una visión completa, desde el propósito de la aplicación hasta las elecciones de diseño, características y validaciones de los campos.

## 📄 Descripción

**Cotizador Corp Qualitas** es un formulario web para crear y gestionar cotizaciones de seguros para clientes corporativos. Construido con HTML, CSS y JavaScript, está destinado a agentes que necesitan recopilar y organizar rápidamente la información esencial del vehículo para calcular primas de seguros precisas. Este cotizador proporciona campos fáciles de usar y mecanismos de validación dinámica para garantizar una entrada de datos sin errores.

El formulario también incluye capacidades de cálculo automático y elementos visuales que mejoran la interacción del usuario, con temas tanto claros como oscuros para una experiencia más cómoda.

### 🌐 Demo en Vivo
Para ver la versión en vivo de este proyecto, visita los siguientes enlaces:
- [Video Principal de Cotizador Corp Qualitas](https://drive.google.com/file/d/1BuKxrj3aIY-X2Vv491pDck39fZWKLpGR/view?usp=sharing)
- [Cotizador Corp Qualitas - GitHub Pages](https://patrimoniales3.github.io/cotizador-corp/cotizador-corp-qualitas.html)

## 🛠️ Características

### 1. Diseño Moderno de UI/UX
- Una interfaz visualmente atractiva diseñada con variables CSS para temas personalizables, incluyendo un **modo oscuro**.
- Construido con un **diseño en tarjetas** que mantiene el contenido organizado y fácil de entender.
- **Diseño responsivo** con consultas `@media` para dispositivos móviles, tabletas y pantallas de escritorio.
- **Barra de progreso** y mensajes de progreso durante la carga de datos para mejorar la interacción del usuario.

### 2. Campos de Formulario Intuitivos
- Una colección de campos de entrada diseñados para facilitar la entrada de datos:
  - **Contratante / Asegurado**: Nombre del asegurado (campo de texto).
  - **DNI / RUC**: Documento de identificación (valida ya sea un DNI de 8 dígitos o un RUC de 11 dígitos).
  - **Placa**: Placa del vehículo, con la opción de `Placa en Trámite`.
  - **Marca** y **Modelo**: Marca y modelo del vehículo, con sugerencias automáticas.
  - **Año**: Año del vehículo, verificando automáticamente la elegibilidad por antigüedad.
  - **Suma Asegurada**: Suma asegurada, con formato de dos decimales.

### 3. Validación Mejorada
- **Validación de DNI / RUC**: Solo permite números de identificación nacionales peruanos válidos o códigos de registro de empresas.
- **Entrada de Placa**: Formatea las entradas de acuerdo con los estándares peruanos (por ejemplo, `AAA-123`).
- **Validación de Año**: Asegura que el año del vehículo sea válido y esté dentro del rango aceptable, y ajusta la casilla de verificación `AUTO AL DEALER` según la antigüedad.
- **Validación de Suma Asegurada**: Formatea automáticamente las entradas numéricas con formato de moneda.

### 4. Integración de Datos de Vehículos
- **Obtención de Datos en Tiempo Real**: Extrae datos de hojas de Google públicas, incluyendo información de vehículos, tarifas de primas y clasificación de riesgos.
- **Análisis de Datos**: Los datos CSV se analizan usando JavaScript para proporcionar información de vehículos actualizada, asegurando cálculos precisos de primas.

### 5. Primas Calculadas Automáticamente
- **Cálculo Automático**: Campos como `TASA NETA`, `PRIMA NETA` y `PRIMA TOTAL` se calculan automáticamente según los criterios seleccionados.
- **Análisis de Riesgo**: Incluye categorías de riesgo como `CATEGORIA I`, `MEDIANO RIESGO`, `ALTO RIESGO` y `CHINO E INDIO` para una estimación de tarifas más precisa.

### 6. Generación Dinámica de PDF Modal
- **Vista Previa y Descarga de PDF**: Los usuarios pueden generar un PDF de la cotización del seguro que se abre en una ventana modal para una fácil verificación.
- **Manejo de Errores**: Alertas para los usuarios en caso de que los datos no se puedan cargar o surjan problemas durante la generación del PDF.

## 🧰 Tecnologías Utilizadas
- **HTML5**: Estructura principal.
- **CSS3**: Estilos personalizados que incluyen diseño responsivo y un sistema de diseño consistente con modos claro y oscuro.
- **JavaScript**: Maneja la validación del formulario, el procesamiento de datos y los cálculos dinámicos.
- **Google Sheets**: Fuente de datos externa para modelos de vehículos, clasificación de riesgos y tarifas de primas.
- **jsPDF & jsPDF AutoTable**: Biblioteca utilizada para generar un resumen en PDF de la cotización.

## 📌 Detalles de Validación y Facilidades
### Campo DNI / RUC
- Acepta solo DNIs de 8 dígitos o RUCs de 11 dígitos.
- Muestra errores de validación cuando no se cumplen los requisitos de formato.

### Campo de Placa
- Transforma automáticamente la entrada a mayúsculas y agrega un `-` para facilitar la legibilidad.
- Casilla de verificación para marcar si la placa está `EN TRÁMITE`, deshabilitando el campo de placa en consecuencia.

### Campos de Año y Marca/Modelo
- **Año**: Solo permite años entre hace 50 años y el año actual.
- **Auto-Dealer Check**: Se activa automáticamente según la antigüedad del vehículo.

## 🗂️ Estructura del Proyecto
- **index.html**: Estructura principal de HTML.
- **/docs/generarpdf.js**: Maneja el proceso de generación de PDF.
- **/imgs/**: Almacena todas las imágenes utilizadas en la aplicación.
- **/css/**: CSS externo para estilos extendidos.

## 🖥️ Instrucciones de Configuración
### Requisitos Previos
- Navegador web: Cualquier navegador moderno como Chrome, Firefox o Edge.
- Conexión a internet para acceder a los datos de Google Sheets.

### Instalación
1. Clona el repositorio en tu máquina local:
   ```bash
   git clone https://github.com/yourusername/cotizador-corp-qualitas.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd cotizador-corp-qualitas
   ```
3. Abre `index.html` en tu navegador web.

## 📋 Guía de Uso
1. **Ingresar Datos**: Completa todos los campos requeridos en el formulario. El formulario te guiará con autocompletado y mensajes de error si es necesario.
2. **Revisar Cálculos**: A medida que completas los campos, las primas de seguro se calcularán automáticamente.
3. **Generar PDF**: Haz clic en `COTIZAR` para generar una vista previa del PDF, revisa la información y descárgalo si es necesario.

## 🎨 Capturas de Pantalla
![Captura de Pantalla 1](imgs/Screen%20Corp%20Qualitas_1.png)
![Captura de Pantalla 2](imgs/Screen%20Corp%20Qualitas_2.png)

## 🚀 Mejoras Futuras
- **Soporte Multilenguaje**: Actualmente solo disponible en español, se podría añadir soporte para otros idiomas.
- **Integración con Base de Datos**: Almacenar las cotizaciones completadas en una base de datos para referencia futura.
- **Autenticación de Usuarios**: Implementar un inicio de sesión simple para acceso autorizado.

## 📞 Contacto
Si tienes alguna pregunta, no dudes en contactar al autor:
- **Nombre**: Bryan Eduardo Abado Jaramillo
- **Email**: [patrimoniales3@gfconsultor.com](mailto:patrimoniales3@gfconsultor.com)
- **GitHub**: [patrimoniales3](https://github.com/patrimoniales3)

---

### ⭐ Contribuciones
¡Las contribuciones son bienvenidas! Por favor, abre un pull request o issue si deseas mejorar esta herramienta.

### 📜 Licencia
Este proyecto está licenciado bajo la Licencia GNU AGPLv3 - consulta el archivo [LICENSE](LICENSE) para más detalles.

---
Gracias por usar **Cotizador Corp Qualitas**. ¡Tu retroalimentación nos ayuda a hacer que el proceso de cotización sea más simple y rápido para todos 🚀.
