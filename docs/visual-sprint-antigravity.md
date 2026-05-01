# Portfolio Visual Sprint Handoff

Documento para que Antigravity u otro agente pueda continuar el trabajo visual del portfolio de forma ordenada, sin cambiar contenido comercial ni tocar backend antes de tiempo.

## Contexto Del Proyecto

Repo: `portafolio-personal`

Stack principal:

- Frontend: React, SASS, Framer Motion, React Router, i18n.
- Backend: Node, Express, Sequelize, MySQL.
- Admin/CMS: existe dentro del mismo frontend/backend.
- Referencia visual disponible: `ProSkills/ui-ux-pro-max-skill`.

Identidad actual que debe mantenerse:

- Dark / high-tech.
- Videos de fondo.
- Glassmorphism.
- Neon sutil azul, violeta y rojo.
- Textos grandes con outline.
- Animaciones con Framer Motion.
- Efecto de luz interactivo.
- Estetica de ingenieria, software, producto digital y tecnologia.
- No debe parecer una plantilla generica.
- No debe parecer el sitio de otra marca.

## Reglas Globales

- Trabajar como mini sprint, no como rediseño masivo.
- Primero auditar, despues implementar.
- Avanzar por fases y pedir aprobacion entre fases.
- No tocar backend, admin, login, base de datos ni rutas salvo que el usuario lo pida.
- No cambiar textos comerciales hasta llegar a la fase correspondiente.
- No romper i18n.
- No agregar dependencias nuevas sin justificar claramente.
- Mantener la identidad visual actual; usar `ProSkills/ui-ux-pro-max-skill` como inspiracion tecnica, no como copia literal.
- Evitar refactors grandes si no son necesarios.
- Validar siempre mobile, desktop, hover/focus y `prefers-reduced-motion`.
- Antes de editar, revisar `git status --short` y no revertir cambios ajenos.

## Zonas Que No Se Tocan En Fase 0

- `backend/`
- Endpoints, modelos, migraciones, seeders.
- Login, registro, perfil, admin y CMS.
- Textos principales de Inicio, Servicios, Proyectos, Detalle y Contacto.
- Rutas.
- Estructura de datos.
- Traducciones comerciales, salvo que una clase/label tecnica lo requiera y no cambie copy visible.

## Archivos A Auditar Primero

Frontend:

- `frontend/src/App.js`
- `frontend/src/index.js`
- `frontend/src/i18n.js`
- `frontend/src/components/layouts/Layout.js`
- `frontend/src/components/layouts/Main.js`
- `frontend/src/components/layouts/Header.js`
- `frontend/src/components/layouts/Nav.js`
- `frontend/src/components/layouts/Footer.js`
- `frontend/src/components/layouts/Background.js`
- `frontend/src/components/GlobalLightTrail.js`
- `frontend/src/pages/Inicio.js`
- `frontend/src/pages/Servicios.js`
- `frontend/src/pages/Proyectos.js`
- `frontend/src/pages/ProyectoDetalle.js`
- `frontend/src/pages/Contacto.js`

Estilos:

- `frontend/src/styles/main.scss`
- `frontend/src/styles/abstracts/_variables.scss`
- `frontend/src/styles/abstracts/_mixins.scss`
- `frontend/src/styles/base/_reset.scss`
- `frontend/src/styles/base/_typography.scss`
- `frontend/src/styles/base/_utilities.scss`
- `frontend/src/styles/layouts/_layout.scss`
- `frontend/src/styles/layouts/_header.scss`
- `frontend/src/styles/layouts/_footer.scss`
- `frontend/src/styles/layouts/Background.scss`
- `frontend/src/styles/components/*.scss`
- `frontend/src/styles/pages/*.scss` si existen.

Referencia:

- `ProSkills/ui-ux-pro-max-skill`

## Fase 0: Base Visual General

Objetivo: elevar la calidad visual general del sistema sin cambiar contenido comercial ni estructura de paginas.

Trabajar sobre:

- Sistema de animaciones reutilizable.
- Glassmorphism.
- Sombras.
- Bordes.
- Fondos con overlays.
- Botones.
- Cards.
- Responsive.
- Estados hover/focus.
- Performance visual.
- `prefers-reduced-motion`.
- Consistencia entre paginas.

No hacer:

- No cambiar headline, subtitulos, textos de servicios, CTA ni contenido comercial.
- No rediseñar paginas completas.
- No tocar backend/admin/login/base de datos.
- No cambiar rutas.

Entregables esperados:

- Archivo reutilizable de animaciones si no existe, por ejemplo `frontend/src/utils/motionVariants.js` o nombre equivalente coherente con el proyecto.
- Mixins/clases SASS reutilizables para glass, glow, overlays, focus y botones.
- Mejoras visuales aplicadas de forma progresiva a componentes compartidos.
- Soporte para `prefers-reduced-motion`.
- Build exitoso.

Variantes de animacion recomendadas:

- `fadeUp`
- `staggerContainer`
- `blurReveal`
- `scaleIn`
- `slideIn`
- `cardHover`
- Versiones reduced-motion friendly.

Mixins/clases recomendadas:

- `glass-card`
- `glass-panel`
- `glow-border`
- `subtle-noise`
- `focus-glow`
- `dark-overlay`

Botones:

- Primary.
- Secondary.
- Ghost.
- Icon/social.
- Hover suave.
- Focus visible.
- Transicion consistente.

Cards:

- Mas separacion del fondo.
- Mejor blur.
- Borde sutil.
- Sombra interna.
- Hover premium.
- Transicion suave.
- Mejor legibilidad contra videos.

Videos de fondo:

- Overlay oscuro con gradiente.
- Mejor contraste de texto.
- El video debe seguir visible.
- No duplicar overlays pesados.

## Fase 1: Inicio

Objetivo: mejorar solo la pagina Inicio despues de aprobar la Fase 0.

Alcance:

- Frase madre.
- Subtitulo.
- Typewriter.
- CTA.
- Jerarquia visual.
- Entrada animada.

No tocar:

- Servicios.
- Proyectos.
- Contacto.
- Backend/admin/login.

Checkpoint:

- Mostrar archivos a tocar.
- Mostrar propuesta visual.
- Mostrar propuesta de contenido.
- Esperar aprobacion antes de implementar.

## Fase 2: Servicios

Objetivo: convertir Servicios en una pagina comercial clara y fuerte.

Servicios principales a incorporar cuando se apruebe cambiar contenido:

- Gestion Digital.
- SaaS & Productos Digitales.
- Apps Web & Mobile.
- IA & Bots.
- BI & Datos en Tiempo Real.
- Automatizacion.

Opcional:

- Bloque "Tambien puedo ayudarte con".

Checkpoint:

- Confirmar estructura de cards o secciones.
- Confirmar nombres finales.
- Confirmar si se actualizan traducciones i18n.

## Fase 3: Proyectos

Objetivo: ordenar proyectos por peso comercial y mejorar su lectura.

Puntos a evaluar:

- Mantener o mejorar pastillas actuales.
- Sumar Bento Grid si aporta.
- Destacar Axxis.
- Destacar Muelle85.
- Ordenar proyectos por relevancia comercial.

No hacer:

- No romper links de detalle.
- No cambiar estructura de datos sin aprobarlo.
- No tocar backend.

## Fase 4: Detalle De Proyecto

Objetivo: que cada detalle cuente mejor el valor del proyecto.

Puntos a evaluar:

- Storytelling.
- Bento interno.
- Radar chart.
- Mockups.
- Skills.
- Servicios vinculados.

No hacer:

- No inventar metricas falsas.
- No cambiar modelo de datos sin aprobacion.

## Fase 5: Contacto

Objetivo: cerrar el portfolio con una experiencia comercial clara y confiable.

Puntos a evaluar:

- Copy comercial.
- Formulario.
- CTA.
- Servicios de interes.
- Validaciones.
- Experiencia de envio.

No hacer:

- No modificar endpoint de contacto sin aprobarlo.
- No tocar email/backend si no es estrictamente necesario.

## Prompt Paso 1: Auditoria Sin Modificar Nada

Usar este prompt antes de cualquier cambio visual:

```text
Necesito que trabajemos ordenados sobre mi portfolio personal.

Antes de modificar cualquier archivo, hace una auditoria del proyecto.

Contexto:
Tengo un portfolio personal con frontend React/SASS, backend Node/Express/Sequelize/MySQL y un sistema de admin/CMS. Ademas tengo dentro del repo una carpeta de referencia llamada:

ProSkills/ui-ux-pro-max-skill

Esa carpeta contiene ejemplos, buenas practicas, estilos, animaciones y patrones UI/UX premium. Quiero que la uses como inspiracion tecnica y visual, pero NO quiero copiar literalmente su diseno ni cambiar la identidad actual de mi portfolio.

Identidad actual del portfolio:
- Dark / high-tech.
- Videos de fondo.
- Glassmorphism.
- Neon sutil azul/violeta/rojo.
- Textos grandes con outline.
- Animaciones con Framer Motion.
- Efecto de luz interactivo.
- Estetica de ingenieria, software, producto digital y tecnologia.
- No quiero que parezca una plantilla generica.
- No quiero que parezca el sitio de otra marca.

Objetivo de trabajo:
Primero vamos a hacer mejoras generales del sistema visual. Despues vamos a trabajar pagina por pagina. No quiero cambios masivos de golpe.

Por ahora NO modifiques archivos.

Tareas de esta auditoria:
1. Revisa la estructura real del proyecto.
2. Identifica los archivos principales del frontend.
3. Identifica donde estan:
   - estilos globales;
   - variables/mixins;
   - layout;
   - header/navbar;
   - cards;
   - botones;
   - animaciones;
   - paginas Inicio, Servicios, Proyectos, Detalle de Proyecto y Contacto.
4. Revisa la carpeta ProSkills/ui-ux-pro-max-skill y detecta que patrones son aplicables a mi portfolio.
5. No propongas cambiar la identidad visual. Solo mejorarla.
6. No tocar backend, admin, login ni base de datos en esta primera etapa.
7. No cambiar textos comerciales todavia.
8. No romper i18n si existe.
9. No agregar dependencias nuevas sin justificar.

Devolveme:
- diagnostico breve;
- archivos encontrados;
- oportunidades de mejora general;
- que patrones de ProSkills usarias;
- que NO tocarias;
- plan de implementacion por fases;
- propuesta concreta para la Fase 0: mejoras generales.
```

## Prompt Paso 2: Implementar Solo Fase 0

Usar solo despues de aprobar la auditoria:

```text
Perfecto. Ahora implementa unicamente la Fase 0: mejoras generales del sistema visual.

No cambies contenido comercial todavia.
No modifiques textos principales de las paginas.
No cambies la estructura de datos.
No toques backend, admin, login ni base de datos.
No cambies rutas.
No rompas i18n.
No redisenes completamente las paginas.

Objetivo:
Elevar la calidad visual general del portfolio usando como referencia la carpeta ProSkills/ui-ux-pro-max-skill, pero manteniendo la estetica actual dark/high-tech/glassmorphism/neon.

Quiero mejoras generales reutilizables:

1. Sistema de animaciones
Crear o mejorar un archivo reutilizable para variantes de animacion.
Puede llamarse segun la estructura existente:
- motionVariants.js
- animations.js
- motion.js
o el nombre que mejor encaje con el proyecto.

Debe incluir:
- fadeUp;
- staggerContainer;
- blurReveal;
- scaleIn;
- slideIn;
- cardHover;
- reduced motion friendly.

Usar Framer Motion si ya esta instalado. No sumar GSAP salvo que ya exista y este claramente justificado.

2. Sistema glassmorphism
Crear o mejorar mixins/clases reutilizables para:
- glass-card;
- glass-panel;
- glow-border;
- subtle-noise;
- focus-glow;
- dark-overlay para videos de fondo.

Debe respetar mi estetica:
- negro profundo;
- azul/violeta/rojo sutil;
- blanco para texto;
- bordes suaves;
- blur real;
- glow controlado;
- nada dorado como color principal.

3. Botones y CTAs
Unificar estilos de botones:
- primary;
- secondary;
- ghost;
- icon/social;
- hover suave;
- focus visible;
- transicion consistente.

No cambiar todavia los textos de los botones.

4. Cards generales
Mejorar cards existentes sin cambiar el contenido:
- mas separacion del fondo;
- mejor blur;
- borde sutil;
- sombra interna;
- hover premium;
- transicion suave;
- evitar que el video de fondo compita con el texto.

5. Videos de fondo
Agregar o mejorar overlays generales:
- gradiente oscuro;
- mejora de legibilidad;
- reduccion de ruido visual;
- no tapar completamente el video.

6. Responsive y accesibilidad
Revisar que las mejoras no rompan mobile.
Agregar soporte para:
- prefers-reduced-motion;
- focus-visible;
- contraste correcto;
- navegacion usable.

7. Performance
Evitar animaciones pesadas.
No duplicar efectos.
No generar renders innecesarios.
No cargar librerias nuevas si no hace falta.

Importante:
Al terminar, devolveme:
- lista de archivos modificados;
- que cambio en cada archivo;
- como probarlo;
- que comandos correr;
- riesgos o cosas a revisar visualmente;
- proximo paso sugerido: Inicio.
```

## Prompt Para Trabajar Pagina Por Pagina

Usar despues de Fase 0, reemplazando `[NOMBRE]` y `[OBJETIVO]`:

```text
Ahora trabajemos SOLO la pagina [NOMBRE].

No toques otras paginas salvo archivos compartidos indispensables.
No cambies backend.
No cambies admin.
No rompas rutas.
No hagas refactor masivo.

Objetivo de esta pagina:
[OBJETIVO]

Primero mostrame:
- que archivos vas a tocar;
- que cambios visuales propones;
- que cambios de contenido propones;
- que cosas vas a mantener.

Despues implementa solo esta pagina.
```

## Criterios De Aprobacion Por Fase

Cada fase debe cerrar con:

- Lista de archivos modificados.
- Resumen claro de cambios.
- Capturas o indicacion de vistas revisadas si se uso navegador.
- Comandos ejecutados.
- Resultado de build.
- Riesgos pendientes.
- Proximo paso sugerido.

Comandos minimos:

```bash
cd frontend
npm run build
npm test
```

Si se toca Docker o deploy:

```bash
docker compose config --quiet
docker compose build frontend
```

Si se toca backend por excepcion:

```bash
cd backend
npm test
docker compose build backend
```

## Checklist Visual

Revisar en desktop y mobile:

- Inicio.
- Servicios.
- Proyectos.
- Detalle de Proyecto.
- Blog si se ve afectado por estilos globales.
- Contacto.

Revisar estados:

- Hover.
- Focus visible.
- Menu mobile.
- Botones CTA.
- Cards.
- Modales si algun estilo global los afecta.
- Reduce motion.

## Notas Para Antigravity

- Si hay cambios previos no relacionados en git, no revertirlos.
- Si aparecen errores de consola, distinguir warnings benignos de errores reales.
- Priorizar legibilidad sobre decoracion.
- Mantener el video de fondo como parte de la identidad, pero no dejar que compita con el contenido.
- No transformar el portfolio en landing generica.
- Si se duda entre una mejora llamativa y una consistente, elegir la consistente.
- Para contenido comercial, esperar fase correspondiente y aprobacion del usuario.
