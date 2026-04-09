# Consulta de Especialistas por Ciudad

Aplicación web frontend para la consulta y visualización de datos de especialistas en salud, basada en filtros por departamento, ciudad y especialidad médica.

Este proyecto representa una versión funcional de un sistema de consulta de datos perteneciente a la empresa **Sistole.co**, propiedad de **Colombia Biomedical**.

---

## Descripción

La aplicación permite consultar información agregada sobre especialistas, incluyendo:

* Total de especialistas
* Distribución por género
* Estado de los especialistas (activos / inactivos)

El sistema está diseñado como una interfaz ligera, rápida y escalable, que actualmente funciona sin backend, utilizando archivos JSON como fuente de datos simulada.

---

## Fuente de datos

Los archivos JSON incluidos en este proyecto:

* `departamentos_v2.json`
* `ciudades_v2.json`
* `especialistas_v2.json`

**NO corresponden a datos reales.**

Estos archivos fueron generados con el propósito de:

* Simular una base de datos real
* Permitir pruebas funcionales del aplicativo
* Facilitar la demostración del flujo completo de consulta

---

## Escalabilidad

La arquitectura del proyecto permite evolucionar fácilmente hacia entornos productivos, integrando:

* APIs REST (Node.js, Flask, etc.)
* Bases de datos reales (MongoDB, PostgreSQL, MySQL)
* Servicios externos de información

El frontend ya está preparado para consumir datos dinámicos mediante `fetch()`, por lo que la transición a un backend real es directa.

---

## Tecnologías utilizadas

* HTML5
* CSS3 (Flexbox, Grid, Animaciones)
* JavaScrip
* Material Icons (Google Fonts)
* JSON como fuente de datos simulada

---

## Estructura del proyecto

```id="9x7d2a"
/Buscador-Especialistas
│
├── index.html
├── style.css
├── app.js
│
├── departamentos_v2.json
├── ciudades_v2.json
└── especialistas_v2.json
```

---

## Funcionamiento

1. La aplicación carga los datos desde archivos JSON utilizando `fetch()`.
2. Se inicializan los filtros dinámicos:

   * Departamento → habilita ciudades relacionadas
   * Ciudad → filtra especialistas
   * Especialidad → opcional
3. El usuario realiza la búsqueda.
4. Se procesan los datos en memoria y se generan estadísticas en tiempo real.
5. Los resultados se renderizan en componentes visuales tipo card.

---

## Características principales

* Autocompletado dinámico con filtrado en tiempo real
* Dependencia entre filtros (Departamento → Ciudad)
* Renderizado dinámico de resultados
* Agrupación por especialidad
* Interfaz moderna con animaciones y efectos visuales
* Indicador de carga (spinner)
* Código limpio, organizado y escalable

---

## Consideraciones técnicas

* No requiere backend para su funcionamiento actual

* Puede desplegarse en:

  * GitHub Pages
  * Vercel

* El uso de `fetch()` requiere ejecutar el proyecto desde un servidor local o remoto
  (no funcionará correctamente abriendo el archivo HTML directamente)

---

## Ejecución local

### Opción 1: Live Server (VS Code)

1. Instalar la extensión **Live Server**
2. Click derecho en `index.html`
3. Seleccionar **Open with Live Server**

### Opción 2: Python

```bash
python -m http.server
```

---

## Proyección del proyecto

Este desarrollo está orientado a integrarse con sistemas reales de la plataforma **Sistole.co**, permitiendo en el futuro:

* Consulta de datos en tiempo real
* Integración con servicios clínicos
* Paneles de analítica y visualización avanzada
* Gestión de usuarios y autenticación

---

## Licencia

Este proyecto es propiedad de Colombia Biomedical.
Todos los derechos reservados. No está permitido su uso, copia o distribución sin autorización previa.

---