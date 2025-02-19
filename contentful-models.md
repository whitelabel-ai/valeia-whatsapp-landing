# Guía Completa de Implementación de Modelos de Contenido en Contentful

## 📋 Instrucciones de Implementación

### Orden de Creación

1. Crear primero los componentes base
2. Luego crear las secciones que utilizan estos componentes
3. Finalmente crear los tipos de páginas que contendrán las secciones

### Consideraciones Importantes

- Todos los IDs de los Content Types deben respetarse exactamente como están documentados
- Los patrones de validación (regex) deben copiarse exactamente
- Las referencias entre contenidos deben configurarse como se indica
- Los valores por defecto deben establecerse como se especifica
- Los campos requeridos deben marcarse como tal

## 🔍 Especificaciones Detalladas

### 1️⃣ Componentes Base

#### 📱 Social Link

**Content Type ID:** `socialLink` **Nombre para mostrar:** "Social Link" **Descripción:** Gestiona los enlaces a redes sociales con sus respectivos íconos.

Fields:

- "Red Social" (Short text)

  - Required
  - Validations: [Facebook, Twitter, Instagram, LinkedIn, YouTube, WhatsApp, TikTok]
  - **Help text**: "Selecciona la red social para mostrar automáticamente su ícono en el sitio. Las opciones disponibles son las redes sociales más populares"

- "Url" (Short text)
  - Required
  - Pattern: ^https?://.\*$
  - **Help text**: "URL completa del perfil social (debe comenzar con http:// o https://). Ejemplo: https://twitter.com/tuempresa"

#### 🎯 Benefit

**Content Type ID:** `benefit` **Nombre para mostrar:** "Benefit" **Descripción:** Define los beneficios o características destacadas del producto/servicio.

Fields:

- "Tab Label" (Short text)

  - Optional
  - **Help text**: "Texto que aparecerá en la pestaña de selección de beneficios. Recomendado: menos de 30 caracteres"

- "Title" (Short text)

  - Required
  - **Help text**: "Título del beneficio. Debe ser claro y llamativo, idealmente en menos de 10 palabras"

- "Description" (Rich Text)

  - Required
  - **Help text**: "Descripción detallada del beneficio. Explica en una o dos frases cómo este beneficio ayuda al usuario"

- "Features" (Short text - List)

  - Optional
  - **Help text**: "Lista de características específicas del beneficio. Cada elemento debe ser una frase corta y concisa, como 'Fácil de usar' o 'Alta seguridad'"

- "Image" (Media - Image)

  - Optional
  - **Help text**: "Imagen ilustrativa del beneficio. Recomendado: 800x600px mínimo, formato 4:3"

- "Image Position" (Short text)

  - Optional
  - Default: "right"
  - Validations: [right, left]
  - **Help text**: "Posición de la imagen respecto al texto. 'right' para derecha, 'left' para izquierda"

- "Cta Text" (Short text)

  - Optional
  - **Help text**: "Texto para el botón principal de llamada a la acción. Máximo 20 caracteres"

- "Cta Url" (Short text)

  - Optional
  - Pattern: ^https?://.\*$
  - **Help text**: "URL completa para el botón principal. Debe comenzar con http:// o https://"

- "Secondary Cta Text" (Short text)

  - Optional
  - **Help text**: "Texto para el botón secundario. Máximo 20 caracteres"

- "Secondary Cta Url" (Short text)
  - Optional
  - Pattern: ^https?://.\*$
  - **Help text**: "URL completa para el botón secundario. Debe comenzar con http:// o https://"

#### 🔄 Process Step

**Content Type ID:** `processStep` **Nombre para mostrar:** "Process Step" **Descripción:** Define los pasos de un proceso o características destacadas.

Fields:

- "Title" (Short text)

  - Required
  - **Help text**: "Título breve y descriptivo del paso. Debe ser claro y conciso, máximo 40 caracteres"

- "Description" (Long text)

  - Required
  - **Help text**: "Descripción detallada que explica qué sucede en este paso y su beneficio para el usuario. Máximo 120 caracteres"

- "Icon" (Short text)

  - Required
  - **Help text**: "Nombre del ícono de Lucide React que mejor represente este paso. Consulta las opciones en https://lucide.dev"

- "Cta Text" (Short text)

  - Optional
  - **Help text**: "Texto para el botón de acción opcional. Debe ser corto y claro, máximo 20 caracteres"

- "Cta Url" (Short text)
  - Optional
  - Pattern: ^https?://.\*$
  - **Help text**: "URL completa donde llevará el botón de acción. Debe comenzar con http:// o https://"

#### 💰 Pricing Plan

**Content Type ID:** `pricingPlan` **Nombre para mostrar:** "Pricing Plan" **Descripción:** Define los planes de precios y sus características.

Fields:

- "Name" (Short text)

  - Required
  - **Help text**: "Nombre del plan que sea fácil de entender (ej: 'Básico', 'Pro', 'Enterprise')"

- "Price" (Short text)

  - Required
  - **Help text**: "Ingrese el precio con el formato: '50 USD', '100 EUR' (monto seguido de la moneda)"

- "Description" (Long text)

  - Required
  - **Help text**: "Descripción breve que resalta el valor principal del plan. Máximo 100 caracteres"

- "Features" (Short text - List)

  - Required
  - **Help text**: "Lista de características incluidas en el plan. Cada elemento debe ser conciso y claro"

- "Highlighted Text" (Boolean)

  - Required
  - Default: false
  - **Help text**: "Activa para destacar este plan como la mejor opción o más popular"

- "Promotional Text" (Short text)

  - Optional
  - **Help text**: "Texto promocional que aparece sobre el plan (ej: '¡Más popular!', '¡Mejor valor!')"

- "Pay Link Text" (Short text)

  - Required
  - **Help text**: "Texto del botón de compra. Debe ser claro y accionable, máximo 20 caracteres"

- "Pay Link" (Short text)

  - Required
  - Pattern: ^https?://.\*$
  - **Help text**: "URL donde el usuario puede contratar este plan. Debe comenzar con http:// o https://"

- "Enable Coupons" (Boolean)

  - Required
  - Default: false
  - **Help text**: "Activa esta opción para mostrar un modal donde el usuario puede ingresar un cupón de descuento"

#### ❓ FAQ

**Content Type ID:** `faq` **Nombre para mostrar:** "FAQ" **Descripción:** Preguntas frecuentes y sus respuestas.

Fields:

- "Question" (Short text)

  - Required
  - **Help text**: "Pregunta frecuente desde la perspectiva del usuario. Debe ser clara y directa"

- "Answer" (Long text)
  - Required
  - **Help text**: "Respuesta clara y concisa. Evita jerga técnica y usa un lenguaje amigable"

### 2️⃣ Secciones

#### 🅰️ Header Section

**Content Type ID:** `headerSection` **Nombre para mostrar:** "Header Section" **Descripción:** Configura el encabezado principal del sitio.

Fields:

- "Logo" (Media - Image)

  - Required
  - **Help text**: "Logo principal del sitio. Preferiblemente SVG o PNG con fondo transparente. Altura recomendada: 40px"

- "Width Logo" (Number)

  - Optional
  - Default: 150
  - **Help text**: "Ancho del logo en píxeles. Ajusta según el tamaño de tu logo"

- "Cta Text" (Short text)

  - Required
  - **Help text**: "Texto del botón principal en el header. Debe ser corto y llamativo, máximo 15 caracteres"

- "Cta Url" (Short text)
  - Required
  - Pattern: ^https?://.\*$
  - **Help text**: "URL del botón principal. Debe comenzar con http:// o https://"

#### 🦸 Hero Section

**Content Type ID:** `heroSection` **Nombre para mostrar:** "Hero Section" **Descripción:** Sección principal de la página de inicio.

Fields:

- "Title" (Short text)

  - Required
  - **Help text**: "Título principal de la página. Debe ser impactante y claro, máximo 70 caracteres"

- "Highlighted Text" (Short text)

  - Optional
  - **Help text**: "Parte del título que se destacará visualmente con un gradiente de color"

- "Description" (Long text)

  - Required
  - **Help text**: "Subtítulo que amplía el título principal. Debe ser claro y persuasivo, máximo 150 caracteres"

- "Cta Text" (Short text)

  - Required
  - **Help text**: "Texto del botón principal. Debe ser accionable, máximo 20 caracteres"

- "Cta Url" (Short text)

  - Required
  - Pattern: ^https?://.\*$
  - **Help text**: "URL del botón principal. Debe comenzar con http:// o https://"

- "Image" (Media - Image)

  - Optional
  - **Help text**: "Imagen principal del hero. Recomendado: 1200x800px, formato 3:2"

- "Image Position" (Short text)

  - Optional
  - Default: "right"
  - Validations: [right, left, top, bottom, background]
  - **Help text**: "Posición de la imagen respecto al texto. 'background' la usará como fondo con overlay"

- "Image Width" (Number)

  - Optional
  - **Help text**: "Ancho máximo de la imagen en píxeles cuando no se usa como fondo"

- "Is Visible" (Boolean)
  - Required
  - Default: true
  - **Help text**: "Controla la visibilidad de la sección en la página"

#### 🤝 Partners Section

**Content Type ID:** `partnersSection` **Nombre para mostrar:** "Partners Section" **Descripción:** Muestra logos de partners o clientes.

Fields:

- "Title" (Short text)

  - Required
  - **Help text**: "Título de la sección que introduce los partners o clientes"

- "Subtitle" (Long text)

  - Optional
  - **Help text**: "Texto descriptivo que proporciona contexto sobre los partners mostrados"

- "Logos" (Media - Multiple images)

  - Required
  - **Help text**: "Logos de partners. Preferiblemente SVG o PNG con fondo transparente. Altura recomendada: 60px"

- "Display Mode" (Short text)

  - Required
  - Validations: [grid, scroll]
  - **Help text**: "'grid' para mostrar en cuadrícula fija, 'scroll' para carrusel automático"

- "Scroll Speed" (Number)

  - Optional
  - Default: 30
  - **Help text**: "Velocidad del carrusel (1-100). Solo aplica si Display Mode es 'scroll'"

- "Height" (Number)

  - Optional
  - Default: 60
  - **Help text**: "Altura en píxeles para todos los logos. Mantener consistencia visual"

- "Background Color" (Short text)

  - Optional
  - Pattern: ^#([A-Fa-f0-9]{6})$
  - **Help text**: "Color de fondo de la sección en formato HEX (#RRGGBB). Si no se especifica, se usará el color del tema"

- "Is Visible" (Boolean)
  - Required
  - Default: true
  - **Help text**: "Controla la visibilidad de la sección en la página"

#### 📈 Process Section

**Content Type ID:** `processSection` **Nombre para mostrar:** "Process Section" **Descripción:** Muestra los pasos de un proceso o características destacadas.

Fields:

- "Title" (Short text)

  - Required
  - **Help text**: "Título principal que describe el proceso o conjunto de características"

- "Subtitle" (Long text)

  - Required
  - **Help text**: "Descripción general que introduce los pasos o características"

- "Steps" (References - Multiple Process Step)

  - Required
  - **Help text**: "Pasos del proceso en orden. Se recomienda entre 3 y 6 pasos para mejor visualización"

- "Is Visible" (Boolean)
  - Required
  - Default: true
  - **Help text**: "Controla la visibilidad de la sección en la página"

#### 🎯 Benefits Section

**Content Type ID:** `benefitsSection` **Nombre para mostrar:** "Benefits Section" **Descripción:** Destaca los beneficios clave del producto/servicio.

Fields:

- "Title" (Short text)

  - Required
  - **Help text**: "Título principal de la sección de beneficios. Debe ser llamativo y claro, máximo 60 caracteres"

- "Subtitle" (Long text)

  - Optional
  - **Help text**: "Subtítulo que introduce los beneficios. Explica brevemente el valor general"

- "Benefits" (References - Multiple Benefit)

  - Required
  - **Help text**: "Lista de beneficios a mostrar. Cada beneficio puede incluir título, descripción, imagen y características"

- "Background Color" (Short text)

  - Optional
  - Pattern: ^#([A-Fa-f0-9]{6})$
  - **Help text**: "Color de fondo de la sección en formato HEX (#RRGGBB). Si no se especifica, se usará el color del tema"

- "Accent Color" (Short text)

  - Optional
  - Pattern: ^#([A-Fa-f0-9]{6})$
  - **Help text**: "Color de acento para elementos destacados. Si no se especifica, se usará el color primario del tema"

- "Is Visible" (Boolean)
  - Required
  - Default: true
  - **Help text**: "Controla la visibilidad de la sección en la página"

#### 💰 Pricing Section

**Content Type ID:** `pricingSection` **Nombre para mostrar:** "Pricing Section" **Descripción:** Muestra los planes de precios disponibles.

Fields:

- "Title" (Short text)

  - Required
  - **Help text**: "Título principal de la sección de precios. Debe ser claro y atractivo"

- "Subtitle" (Long text)

  - Required
  - **Help text**: "Texto introductorio que ayuda a los usuarios a elegir el plan adecuado"

- "Plans" (References - Multiple Pricing Plan)

  - Required
  - **Help text**: "Planes a mostrar. Ordénalos de menor a mayor precio para mejor comprensión"

- "Is Visible" (Boolean)

  - Required
  - Default: true
  - **Help text**: "Controla la visibilidad de la sección en la página"

- "Coupons Endpoint" (Short text)

  - Required
  - Pattern: ^https?://.\*$
  - **Help text**: "URL para consultar cupones disponibles y descuento(GET)"

#### ❓ FAQ Section

**Content Type ID:** `faqSection` **Nombre para mostrar:** "FAQ Section" **Descripción:** Sección de preguntas frecuentes.

Fields:

- "Title" (Short text)

  - Required
  - **Help text**: "Título de la sección FAQ. Generalmente 'Preguntas Frecuentes' o similar"

- "Subtitle" (Long text)

  - Required
  - **Help text**: "Texto introductorio que anima a los usuarios a explorar las FAQ"

- "Faqs" (References - Multiple FAQ)

  - Required
  - **Help text**: "Lista de preguntas frecuentes. Organízalas por relevancia o tema"

- "Columns" (Number)

  - Optional
  - Default: 1
  - Validations: [1, 2]
  - **Help text**: "Número de columnas para mostrar las FAQ. 1 para lista simple, 2 para dos columnas"

- "Is Visible" (Boolean)
  - Required
  - Default: true
  - **Help text**: "Controla la visibilidad de la sección en la página"

#### 🎯 CTA Section

**Content Type ID:** `ctaSection` **Nombre para mostrar:** "CTA Section" **Descripción:** Sección de llamada a la acción.

Fields:

- "Title" (Short text)

  - Required
  - **Help text**: "Título llamativo que impulsa a la acción. Debe ser persuasivo y directo"

- "Subtitle" (Long text)

  - Required
  - **Help text**: "Texto que refuerza el título y explica el valor de tomar acción"

- "Cta Text" (Short text)

  - Required
  - **Help text**: "Texto del botón principal. Debe ser accionable y claro, máximo 20 caracteres"

- "Cta Url" (Short text)

  - Required
  - Pattern: ^https?://.\*$
  - **Help text**: "URL del botón principal. Debe comenzar con http:// o https://"

- "Is Visible" (Boolean)
  - Required
  - Default: true
  - **Help text**: "Controla la visibilidad de la sección en la página"

#### 👣 Footer Section

**Content Type ID:** `footerSection` **Nombre para mostrar:** "Footer Section" **Descripción:** Configura el pie de página del sitio.

Fields:

- "Logo" (Media - Image)

  - Required
  - **Help text**: "Logo para el footer. Preferiblemente SVG o PNG con fondo transparente"

- "Width Logo" (Number)

  - Optional
  - Default: 150
  - **Help text**: "Ancho del logo en píxeles en el footer"

- "Social Links" (References - Multiple Social Link)

  - Required
  - **Help text**: "Enlaces a redes sociales a mostrar en el footer"

- "Email" (Short text)

  - Required
  - Pattern: ^[^\s@]+@[^\s@]+\.[^\s@]+$
  - **Help text**: "Email de contacto principal de la empresa"

- "Phone" (Short text)

  - Required
  - **Help text**: "Teléfono de contacto. Usar formato internacional (+XX XXX XXX XXXX)"

- "Copyright" (Short text)

  - Required
  - **Help text**: "Texto de derechos de autor. Incluir año y nombre de la empresa"

- "Is Visible" (Boolean)
  - Required
  - Default: true
  - **Help text**: "Controla la visibilidad del footer en la página"

### 3️⃣ Páginas

#### 🏠 Landing Page

**Content Type ID:** `landingPage` **Nombre para mostrar:** "Landing Page" **Descripción:** Página principal del sitio.

Fields:

- "Internal Name" (Short text)

  - Required
  - **Help text**: "Nombre interno para identificar esta página en el CMS. Solo visible para editores"

- "Slug" (Short text)

  - Required
  - Default: "/"
  - Pattern: ^/$
  - Unique
  - **Help text**: "URL de la página principal. Mantener como '/'"

- "Title" (Short text)

  - Required
  - **Help text**: "Título SEO de la página. Incluye palabras clave importantes, máximo 60 caracteres"

- "Description" (Long text)

  - Required
  - **Help text**: "Meta descripción SEO. Describe la página de forma atractiva, 150-160 caracteres"

- "Theme" (Short text)

  - Optional
  - **Help text**: "Tema visual a utilizar. Si no se especifica, se usará el tema por defecto"

- "Custom Theme" (Reference - Single Custom Theme)

  - Optional
  - **Help text**: "Tema personalizado con colores y estilos específicos"

- "Sections" (References - Multiple)

  - Required
  - **Help text**: "Secciones que compondrán la página. Arrastra para reordenar según necesites"

- "Google Tag Manager" (Short text)

  - Optional
  - **Help text**: "ID de Google Tag Manager (formato: GTM-XXXXXX) para análisis"

- "Valeia Chat" (Boolean)

  - Optional
  - Default: false
  - **Help text**: "Activa el widget de chat de ValeIA en la página"

- "Is Visible" (Boolean)
  - Required
  - Default: true
  - **Help text**: "Controla si la página está publicada y visible"

#### 📄 Dynamic Page

**Content Type ID:** `dynamicPage` **Nombre para mostrar:** "Dynamic Page" **Descripción:** Páginas dinámicas como blog posts o páginas de contenido.

Fields:

- "Title" (Short text)

  - Required
  - **Help text**: "Título principal de la página. Debe ser descriptivo y contener palabras clave relevantes"

- "Slug" (Short text)

  - Required
  - Pattern: ^[a-z0-9-]+$
  - Unique
  - **Help text**: "URL amigable de la página. Usar guiones y minúsculas, sin espacios ni caracteres especiales"

- "Content" (Rich Text)

  - Required
  - **Help text**: "Contenido principal de la página. Usar formato rico para mejor presentación"

- "Featured Image" (Media - Image)

  - Optional
  - **Help text**: "Imagen destacada para la página. Recomendado: 1200x630px para mejor compartición en redes"

- "Is Visible" (Boolean)

  - Required
  - Default: true
  - **Help text**: "Controla la visibilidad de la página"

- "Label" (Short text)

  - Required
  - **Help text**: "Texto para mostrar en menús de navegación. Debe ser corto y descriptivo"

- "Location" (Short text)

  - Required
  - Validations: [header, footer, blog, legal, null]
  - **Help text**: "Ubicación del enlace en la navegación. 'null' si no debe aparecer en menús"

- "Author" (Short text)

  - Optional
  - **Help text**: "Autor del contenido. Relevante para posts de blog"

- "Publish Date" (Date and time)

  - Optional
  - **Help text**: "Fecha de publicación. Importante para ordenar posts de blog"

- "Tags" (Short text - Array)
  - Optional
  - **Help text**: "Categorías o etiquetas para clasificar el contenido. Útil para filtrado y SEO"

#### 🎨 Custom Theme

**Content Type ID:** `customTheme` **Nombre para mostrar:** "Custom Theme" **Descripción:** Tema personalizado para la landing page.

Fields:

- "Name" (Short text)

  - Required
  - **Help text**: "Nombre identificativo del tema personalizado"

- "Primary Color" (Short text)

  - Required
  - Pattern: ^#([A-Fa-f0-9]{6})$
  - Default: "#7c3aed"
  - **Help text**: "Color principal para botones y elementos destacados (formato: #RRGGBB)"

- "Accent Color" (Short text)

  - Optional
  - Pattern: ^#([A-Fa-f0-9]{6})$
  - **Help text**: "Color secundario para gradientes. Si no se especifica, se usará el color principal"

- "Background Color" (Short text)

  - Required
  - Pattern: ^#([A-Fa-f0-9]{6})$
  - Default: "#ffffff"
  - **Help text**: "Color de fondo del sitio (formato: #RRGGBB)"

- "Text Color" (Short text)

  - Required
  - Pattern: ^#([A-Fa-f0-9]{6})$
  - Default: "#000000"
  - **Help text**: "Color del texto principal (formato: #RRGGBB)"

- "Style" (Short text)

  - Required
  - Default: "gradient"
  - Validations: [minimal, gradient, glass]
  - **Help text**: "Estilo visual: 'minimal' (sin efectos), 'gradient' (con gradientes), 'glass' (efecto cristal)"

- "Border Radius" (Number)

  - Optional
  - Default: 8
  - Validation: Min: 0, Max: 20
  - **Help text**: "Radio de borde en píxeles para elementos redondeados (0-20)"

- "Preview" (Media - Image)
  - Optional
  - **Help text**: "Vista previa del tema personalizado para referencia"

# 📢 Lead Magnet Section

**Content Type ID:** `leadMagnetSection` **Nombre para mostrar:** "Lead Magnet Section" **Descripción:** Sección para captura de leads con un recurso descargable destacado.

Fields:

- "Title" (Short text)

  - Required
  - **Help text**: "Título principal que destaca el valor del recurso"

- "Subtitle" (Long text)

  - Required
  - **Help text**: "Subtítulo que explica el beneficio principal del recurso"

- "Lead Magnet" (Reference - Single Lead Magnet)

  - Required
  - **Help text**: "Recurso descargable a ofrecer"

- "Title Modal" (Short text)

  - Required
  - **Help text**: "Título del formulario de descarga"

- "Subtitle Modal" (Long text)

  - Required
  - **Help text**: "Texto explicativo del formulario"

- "Cta Text Modal" (Short text)

  - Required
  - Default: "Descargar ahora"
  - **Help text**: "Texto del botón de envío"

- "Fields To Capture" (Short text - List)

  - Required
  - Validations: [nombre, email, teléfono, empresa, cargo, país]
  - **Help text**: "Campos del formulario. 'email' siempre incluido"

- "Submit Endpoint" (Short text)

  - Required
  - Pattern: ^https?://.\*$
  - **Help text**: "URL para envío del formulario (POST)"

- "Confirmation Title" (Short text)

  - Required
  - Default: "¡Gracias!"
  - **Help text**: "Título del mensaje de confirmación"

- "Confirmation Message" (Long text)

  - Required
  - **Help text**: "Mensaje mostrado tras enviar el formulario"

- "Background Color" (Short text)

  - Optional
  - Pattern: ^#([A-Fa-f0-9]{6})?$
  - **Help text**: "Color de fondo en formato HEX (#RRGGBB)"

- "Is Visible" (Boolean)
  - Required
  - Default: true
  - **Help text**: "Controla la visibilidad de la sección"

# 📢 Lead Magnet

**Content Type ID:** `leadMagnet` **Nombre para mostrar:** "Lead Magnet" **Descripción:** Recurso descargable con sus características y beneficios.

Fields:

- "Title" (Short text)

  - Required
  - **Help text**: "Título del recurso"

- "Description" (Rich text)

  - Required
  - **Help text**: "Descripción detallada del recurso"

- "Image" (Media - Image)

  - Required
  - **Help text**: "Imagen del recurso. Recomendado: 800x600px"

- "Image Position" (Short text)

  - Optional
  - Default: "right"
  - Validations: [right, left]
  - **Help text**: "Posición de la imagen respecto al texto"

- "Features" (Short text - List)

  - Optional
  - **Help text**: "Lista de características o beneficios clave del recurso"

- "Cta Text" (Short text)
  - Required
  - Default: "Descargar ahora"
  - **Help text**: "Texto del botón de descarga"
