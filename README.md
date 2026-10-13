# Publicación del mockup en GitHub Pages

La raíz del repositorio Git es esta carpeta `front-cdir` (no la carpeta padre `CDIR-WEB`). El workflow `.github/workflows/deploy.yml` se ejecuta en pushes a `main` o manualmente; usa Node.js 20.x, `npm ci`, caché npm/Next y las acciones oficiales de Pages. No se ha publicado desde esta sesión.

1. Sube los cambios al repositorio de GitHub **front-cdir**.
2. En **Settings → Pages → Build and deployment → Source**, elige **GitHub Actions**.
3. Ejecuta el workflow o haz push a `main`.
4. La dirección será `https://<usuario>.github.io/front-cdir/`.

`next.config.ts` usa `output: 'export'`, `basePath: '/front-cdir'`, `trailingSlash: true` e imágenes sin optimización de servidor. No necesita `assetPrefix`: Next ya aplica `basePath` a `_next`. Los componentes de imágenes/enlaces HTML aplican el prefijo a los recursos públicos y anclas internas; `next/link` lo aplica automáticamente. Fuentes y fondos CSS también están prefijados. Si cambia el nombre del repositorio, actualiza configuración, `lib/site-path.ts`, CSS, icono y scripts de prueba/preview.

`npm run build` genera `out/`. El postbuild añade alias de los segmentos estáticos para corregir los separadores de Windows en Next 16.4; en Linux no modifica los nombres ya correctos. `npm start` sirve esa exportación en `http://127.0.0.1:3000/front-cdir/`. `npm run test:pages` revisa todos los HTML/CSS exportados y sus enlaces/recursos locales; se ejecuta también en Actions.

**Compatibilidad:** todas las rutas variables tienen `generateStaticParams` y `dynamicParams: false`. No se usan cookies/headers de servidor, Server Actions ni SSR dinámico. El consentimiento de cookies funciona en el navegador. La ruta POST de inscripción, incompatible con Pages, se conserva en `server/registration-route.ts`, fuera de `app/`; sus pruebas simuladas se mantienen. No se incluye en `out`. Para recuperar envíos reales habrá que alojarla en un servidor y conectar el frontal; no se debe exponer una inscripción ficticia como recibida. Los formularios del mockup están señalizados y no realizan peticiones al sistema del club.

---

# CDIR · Aquí jugamos todos

Frontal en Next.js App Router, React y TypeScript para el Club Deportivo Inclusivo Rozasbasket. Propuesta local; no sustituye todavía la web publicada.

## Desarrollo

Requiere Node.js 20.9 o posterior.

```sh
npm install
npm run dev
```

Abrir http://127.0.0.1:3000/front-cdir/. Para producción: `npm run build` y después `npm start`.

## Arquitectura

- `app/layout.tsx`: layout, idioma español y metadatos SEO.
- `app/page.tsx`: contenido renderizado en el servidor.
- `components/club-experience.tsx`: interacciones progresivas, diálogo nativo, filtros, menú móvil y animaciones al entrar en pantalla. Los listeners y observadores se limpian al desmontar.
- `app/globals.css`: diseño responsive, animaciones, estados de foco y soporte de movimiento reducido.
- `prototype/`: copia de referencia de la primera versión HTML, fuera de las rutas de Next.js.

## Experiencia

Portada animada, navegación fija, progreso de lectura, actividades filtrables, presentación inclusiva del club, campus y eventos, revista, redes, colaboración y un recorrido de tres pasos para unirse. Los formularios nativos funcionan como demostración en GitHub Pages: validan y permiten revisar datos ficticios, sin enviar solicitudes.

## Pendiente para publicar

Validar la recepción en el administrador y en el correo del club antes de publicar. Si se desea abandonar también el backend de WordPress, será necesario sustituir su almacenamiento y envío. Las imágenes y fuentes ya se alojan localmente. Las publicaciones históricas se identifican como archivo; no se anuncian eventos pasados como próximos.

## Comprobaciones

`npm run check` comprueba TypeScript; `npm run build` valida y compila la aplicación para producción.

## Ampliación del sitio

Identidad turquesa, azul marino y blanco basada en el escudo. Cabecera y pie compartidos; menú desplegable por categorías. 57 páginas importadas, cuatro índices nuevos y portada. Ver INVENTARIO-WEB.md para el inventario de las 62 URLs originales revisadas. Imágenes reales guardadas en public/club. Carrusel automático con teclado, pausa y controles, perfiles sociales oficiales y botón flotante de WhatsApp.

Las páginas de escuela base, federados, municipales e IES Carmen Conde incluyen información previa, requisitos, FAQ y acceso a su nuevo formulario nativo. Las inscripciones aún se procesan en WordPress. Los eventos históricos tienen aviso de archivo.

Pruebas: npm run build, npm run check, node scripts/visual.cjs y node scripts/verify.cjs. Las pruebas de navegador requieren Microsoft Edge instalado. Se revisaron capturas de escritorio y móvil, recorrido a inscripción, carrusel, menú y todas las rutas de contenido.

## Interacciones y guía local

Carrusel automático cada cuatro segundos cuando está visible; pausa al pasar el ratón, al enfocar controles, al ocultar la pestaña y con preferencia de movimiento reducido. Botón de pausa manual. Animación progresiva de todas las secciones y tarjetas. Menú por hover en escritorio y clic en móvil, con soporte de teclado. Inscripción mediante tarjetas por intención. Instagram en SVG, WhatsApp verde y nueve patrocinadores en portada.

El guía funciona completamente en el navegador con un diccionario de temas, normalización de acentos y distancia de edición para erratas pequeñas. No utiliza IA ni servicios externos, no guarda mensajes y no inventa datos de plazas, cuotas o horarios. Configuración de respuestas en lib/guide.ts. Verificación de estas interacciones: node scripts/enhancements-test.cjs.

## Privacidad y programa de familias 2026–2027

Panel de consentimiento con aceptar, rechazar, categorías, reapertura desde el pie, persistencia versionada y caducidad a los 180 días. No hay analítica, publicidad ni feeds incrustados; las opciones no activan servicios inexistentes. Todas las imágenes y fuentes del frontal se sirven desde public. Para futuras integraciones, usar consentAllows y renovar la versión del consentimiento al cambiar servicios o finalidades.

Nuevas páginas: /salud, /salud/psicologia, /salud/preparacion-fisica, /salud/fisioterapia y /familias. Contenido y responsables basados en las páginas 5 y 19–26 de la presentación de familias 2026–2027. Las fotografías ilustran la actividad del club; no se identifican como retratos de los responsables.

Se descargaron 16 fotografías adicionales y se extrajeron 16 imágenes del PDF. Se utiliza una selección variada en portada, carrusel, salud y familias. Fuentes alojadas localmente. Prueba dedicada: node scripts/privacy-health-test.cjs (cookies, persistencia, preferencias, retirada, caducidad, salud, móvil y ausencia de peticiones externas).

## Formularios nativos y conexión al club

Siete formularios en /inscripcion: escuela, federados, municipales, ies, mecenas, contacto y contacto-jugador. Flujo por pasos, validación, adjuntos conservados al volver, domiciliación condicional, consentimiento de imágenes independiente y revisión final. No se guardan datos de la solicitud en localStorage.

El adaptador /api/inscripcion usa el contrato público NEX-Forms: acción submit_nex_form, IDs y nombres originales, multipart hacia https://cdir.es/wp-admin/admin-ajax.php. Verifica que el ID siga presente en la página pública, valida datos y archivos, limita tamaño y frecuencia, no registra los datos ni inventa confirmaciones cuando la respuesta es desconocida. No hay reintento automático tras una respuesta incierta.

Importante: municipales e IES reutilizan super_select para dos consentimientos en el HTML antiguo. El adaptador preserva ambos por separado en cdir_consentimiento_imagenes y cdir_aceptacion_privacidad y envía el valor más restrictivo en el campo compartido. Hay que comprobar en WordPress que los nuevos campos se guardan y aparecen en los correos, y corregir allí los nombres duplicados antes de producción.

Pruebas: node scripts/registration-adapter-test.cjs y node scripts/registration-ui-test.cjs. El adaptador se prueba con respuestas de WordPress simuladas; en las pruebas de navegador el envío se intercepta. No se han enviado inscripciones reales. Pendiente confirmar recepción y correo en el club.

Patrocinadores: carrusel continuo en portada y en /patrocinadores, con pausa por hover, foco y botón. Desactiva el movimiento con prefers-reduced-motion.

## Cabecera y adaptación responsive

Cabecera reconstruida con controles homogéneos y etiquetas alineadas, incluido Contacto. Menú móvil desde 1120 px para evitar compresión de los enlaces; hover solo por encima de ese ancho. La entrada de inscripción del modal y la cabecera de cada actividad lleva directamente al formulario nativo. La web pública cdir.es no se ha modificado: la versión nueva está en localhost hasta su publicación.

Validación adicional: node scripts/responsive-test.cjs. Se probaron 14 anchos de 320 a 2560 px, la posición real de las etiquetas, menú por clic, las páginas principales y el formulario local. Corregidos los desbordamientos del título y carrusel de patrocinadores. Inputs de formulario a 16 px en móvil para evitar zoom automático de entrada en Safari.
