# Consulta de Especialistas por Ciudad — v1.2

Aplicación frontend para la consulta y visualización de datos de especialistas en salud, con filtros por departamento, ciudad y especialidad médica.

Este proyecto representa una versión funcional de un sistema de consulta de datos perteneciente a la empresa **Sistole.co**, propiedad de **Colombia Biomedical**.

---

## Changelog

### v1.2 — Migración a Angular
- Migración completa de la aplicación desde HTML/CSS/JS vanilla a **Angular 21**
- Arquitectura basada en componentes standalone con separación de responsabilidades
- Servicio dedicado `EspecialistasService` para la carga de datos via `HttpClient`
- Corrección del ciclo de detección de cambios con `NgZone` para el spinner de carga
- Tipado estático completo mediante interfaces TypeScript (`Departamento`, `Ciudad`, `Especialista`, `CardStats`)
- Cierre automático de dropdowns con `HostListener` sobre el documento
- Responsive mejorado para mobile con breakpoints en 1024px, 768px y 480px

### v1.1 — Mejoras visuales y funcionales
- Rediseño del layout de cards con CSS Grid (`repeat(4, 1fr)`)
- Stats internos reorganizados en grid de 2 columnas con label + valor apilados
- Corrección de desbordamiento en cards con `min-width: 0` y `box-sizing: border-box`
- Item impar en stats centrado automáticamente con `grid-column: 1 / -1`

### v1.0 — Versión inicial
- Buscador funcional con HTML, CSS y JavaScript vanilla
- Carga de datos desde archivos JSON con `fetch()`
- Filtros encadenados: Departamento → Ciudad → Especialidad

---

## Descripción

La aplicación permite consultar información agregada sobre especialistas, incluyendo:

- Total de especialistas por especialidad
- Distribución por género (mujeres / hombres)
- Estado (activos / inactivos)
- Distribución por tipo de afiliación (EPS / IPS / Consultorio)

El sistema funciona sin backend, utilizando archivos JSON como fuente de datos simulada, y está diseñado para escalar hacia una integración con APIs REST reales.

---

## Fuente de datos

Los archivos JSON incluidos en este proyecto:

- `departamentos_v2.json`
- `ciudades_v2.json`
- `especialistas_v2.json`

**NO corresponden a datos reales.** Fueron generados para simular una base de datos, permitir pruebas funcionales y facilitar la demostración del flujo completo de consulta.

---

## Tecnologías utilizadas

- Angular 21 (standalone components)
- TypeScript
- RxJS (`forkJoin`, `HttpClient`)
- CSS3 (Flexbox, Grid, Animaciones, Media Queries)
- Material Icons (Google Fonts)
- JSON como fuente de datos simulada

---

## Requisitos

- Node.js 18 o superior
- Angular CLI 21

```bash
npm install -g @angular/cli
```

---

## Estructura del proyecto

```
buscador-especialistas-angular/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── buscador/
│   │   │   │   ├── buscador.component.ts
│   │   │   │   ├── buscador.component.html
│   │   │   │   └── buscador.component.css
│   │   │   └── card/
│   │   │       ├── card.component.ts
│   │   │       ├── card.component.html
│   │   │       └── card.component.css
│   │   ├── models/
│   │   │   └── interfaces.ts
│   │   ├── services/
│   │   │   └── especialistas.service.ts
│   │   ├── app.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/
│   │   ├── departamentos_v2.json
│   │   ├── ciudades_v2.json
│   │   └── especialistas_v2.json
│   ├── index.html
│   ├── main.ts
│   └── styles.css
└── angular.json
```

---

## Ejecución local

```bash
# Instalar dependencias
npm install

# Levantar servidor de desarrollo
ng serve
```

Abrir en el navegador: `http://localhost:4200`

---

## Funcionamiento

1. La aplicación carga los tres JSON desde `assets/` mediante `HttpClient` con `forkJoin`.
2. Se inicializan los filtros dinámicos con autocompletado en tiempo real:
   - Departamento → habilita y filtra las ciudades relacionadas
   - Ciudad → filtra el conjunto de especialistas
   - Especialidad → opcional, filtra dentro de la ciudad seleccionada
3. El usuario ejecuta la búsqueda.
4. Los datos se procesan en memoria y se generan estadísticas agrupadas por especialidad.
5. Los resultados se renderizan como cards clickeables. Al seleccionar una card se accede al detalle con el listado individual de especialistas.

---

## Arquitectura

La comunicación entre componentes es unidireccional. `BuscadorComponent` centraliza el estado y la lógica de negocio. `CardComponent` es puramente presentacional y recibe datos via `@Input()`. `EspecialistasService` abstrae la carga de datos y devuelve un único `Observable` con los tres recursos en paralelo.

El ciclo de detección de cambios se gestiona explícitamente con `NgZone.run()` dentro del bloque asíncrono del spinner, garantizando que Angular actualice la vista al finalizar el procesamiento sin depender de un evento externo.

---

## Escalabilidad

La arquitectura permite evolucionar hacia entornos productivos reemplazando las rutas de `assets/` en `EspecialistasService` por endpoints REST. No requiere cambios en los componentes.

Integraciones previstas:

- APIs REST (Node.js, Flask, Spring Boot)
- Bases de datos relacionales o NoSQL (PostgreSQL, MongoDB)
- Autenticación y gestión de usuarios
- Paneles de analítica y visualización avanzada

---

## Despliegue

```bash
ng build --configuration production
```

El output generado en `dist/` puede desplegarse en:

- Vercel
- Netlify
- GitHub Pages (requiere configuración de `base-href`)
- Cualquier servidor de archivos estáticos (Nginx, Apache)

---

## Proyección

Este desarrollo está orientado a integrarse con los sistemas reales de la plataforma **Sistole.co**, habilitando en el futuro consulta de datos en tiempo real, integración con servicios clínicos y gestión de usuarios con autenticación.

---

## Autor

Desarrollado Por Jhoan Rojas

---

## Licencia

Este proyecto es propiedad de Colombia Biomedical.
Todos los derechos reservados. No está permitido su uso, copia o distribución sin autorización previa.