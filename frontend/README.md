# Frontend Portafolio – Documentación  

## Introducción

Este proyecto es una aplicación frontend construida con **React**. Sirve como sitio web de portafolio personal, mostrando servicios, proyectos, publicaciones de blog e información de contacto. La aplicación presenta transiciones de página suaves, diseño responsivo y una estética moderna inspirada en temas cyberpunk.

## Características

- **Arquitectura Modular**: Componentes bien organizados y reutilizables.
- **Diseño Responsivo**: Enfoque mobile-first que asegura compatibilidad en todos los dispositivos.
- **Transiciones Animadas**: Transiciones de página fluidas usando **Framer Motion**.
- **Estilizado con SCSS**: Estilos organizados con variables, mixins y parciales.
- **Contexto de Navegación**: Manejo dinámico de la navegación con React Context API.
- **Accesibilidad**: Consideración de HTML semántico y atributos ARIA.
- **División de Código**: Carga eficiente con estrategias de división de código.

## Estructura del Proyecto

src/

├── components/
│   │
│   ├── layouts/
│   │   │
│   │   ├── Footer.js
│   │   │
│   │   ├── Header.js
│   │   │
│   │   ├── Layout.js
│   │   │
│   │   ├── Main.js
│   │   │
│   │   ├── Nav.js
│   │   │
│   │   └── Telefono.js
│   │
│   ├── FloatingButton.js
│   │
│   └── SkillBubble.js
│
├── context/
│   │
│   └── NavigationContext.js
│
├── pages/
│   │
│   ├── Blog.js
│   │
│   ├── Contacto.js
│   │
│   ├── Inicio.js
│   │
│   ├── Proyectos.js
│   │
│   └── Servicios.js
│
├── styles/
│   │
│   ├── abstracts/
│   │   │
│   │   ├── \_mixins.scss
│   │   │
│   │   └── \_variables.scss
│   │
│   ├── base/
│   │   │
│   │   ├── \_reset.scss
│   │   │
│   │   └── \_typography.scss │   ├── layouts/
│   │
│   │   ├── \_footer.scss
│   │   │  
│   │   ├── \_header.scss
│   │   │
│   │   ├── \_layout.scss
│   │   │
│   │   └── \_telefono.scss
│   │
│   └── main.scss
│
├── App.js
│
├── index.js
│
└── package.json

## Requisitos Previos

- **Node.js** (versión 14 o superior)
- **npm** (versión 6 o superior)

## Instalación

Para comenzar con el proyecto, sigue estos pasos:

1.**Clona el repositorio**:

git clone[ https://github.com/Enzopinotti/portafolio-personal.git ]

2.**Navega al directorio del proyecto**:

cd portafolio-personal

3.**Instala las dependencias**:

npm install

## Dependencias

El proyecto depende de las siguientes principales dependencias:

- **React**: Librería de UI para construir componentes.
- **React Router DOM**: Enrutamiento y navegación.
- **Framer Motion**: Animaciones y transiciones.
- **Sass**: Estilizado con sintaxis SCSS.
- **React Icons**: Librería de íconos para React.
- **QRCode.react**: Generación de códigos QR en React.
- **React Modal**: Diálogos modales accesibles.
- **React Circular Progressbar**: Indicadores circulares de progreso.
- **Formik & Yup**: Manejo y validación de formularios.
- **Axios**: Cliente HTTP basado en promesas.

Consulta el archivo **package.json** para la lista completa y versiones.

## Ejecutando la Aplicación

Para ejecutar la aplicación en modo de desarrollo:

npm start

La aplicación estará disponible en <http://localhost:3000>.

Notas de Desarrollo

Advertencia de Deprecación de Sass

**Problema**: Aparece una advertencia de deprecación debido a la API JS heredada en Dart Sass.

**Recomendación**: Esta advertencia puede ignorarse por ahora, ya que se espera que se resuelva en futuras actualizaciones de las dependencias. No afecta el funcionamiento de la aplicación.

**Detalle de la Advertencia**:

Deprecation The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.

More info:[https://sass-lang.com/d/legacy-js-api](https://sass-lang.com/d/legacy-js-api)

## Buenas Prácticas

- **Componentes Modulares**: Cada componente tiene una única responsabilidad y es reutilizable.
- **Context API**: Utilizado para el estado que necesita ser accedido por múltiples componentes.
- **Código Limpio**:
- Convenciones de nombres consistentes.
- Comentarios para lógica compleja.
- Evitar código innecesario.
- **Diseño Responsivo**: Se utilizan consultas de medios y unidades flexibles para asegurar que la aplicación se vea bien en todos los dispositivos.
- **Accesibilidad**:
- Elementos HTML semánticos.
- Atributos ARIA donde sea necesario.

## Mejoras Futuras

- **Pruebas Unitarias**: Implementar pruebas usando Jest y React Testing Library.
- **Migración a TypeScript**: Mejorar la seguridad de tipos y mantenibilidad del código.
- **Optimización de Rendimiento**:
- Implementar división de código con React.lazy y Suspense.
- Optimizar imágenes y recursos.
- **Mejoras de SEO**:
  - Implementar renderizado del lado del servidor (SSR) si es necesario.
  - Utilizar metaetiquetas apropiadamente.
- **Autenticación de Usuario**:
- Integrar funcionalidad de inicio de sesión con APIs de backend.
- Proteger rutas que requieren autenticación.
