# Design — Arquitectura de Frontend, Jerarquía de Componentes y Estado

## 1. Principio Fundamental: Cliente Puramente Presentacional ("Dumb Client")
- El cliente web React es un visualizador y capturador de datos.
- Queda terminantemente prohibido ejecutar lógica de pricing, márgenes comerciales, desglose de impuestos o cálculos de facturación en el navegador (CWE-602).
- Todas las operaciones monetarias se envían al backend vía API REST y se despliegan según la respuesta autoritativa del servidor.

---

## 2. Organización Jerárquica del Frontend (`frontend/src/`)

El frontend debe organizarse bajo el patrón **Feature-Driven Architecture** con componentes de interfaz compartidos:

```text
src/
├── assets/                     # Imágenes, logos e íconos globales
├── components/                 # Componentes Compartidos (Design System)
│   ├── ui/                     # Botones, Inputs, Modales, Badges, Tabs
│   ├── layout/                 # Navbar, Sidebar, PageHeader, AppShell
│   └── feedback/               # Skeletons de carga, alertas y banners de error
├── features/                   # Módulos Funcionales Verticales
│   ├── cotizaciones/           # Feature de cotizaciones
│   │   ├── components/         # Componentes visuales específicos de la feature
│   │   │   └── TablaItems/     # Co-ubicación de componentes medianos (index.ts, etc.)
│   │   ├── hooks/              # Custom hooks de la feature (useCotizacion.ts)
│   │   ├── services/           # Clientes HTTP hacia la API de cotizaciones
│   │   ├── types/              # DTOs y tipos TypeScript de la feature
│   │   └── index.ts            # Exportaciones públicas de la feature
│   └── catalogos/              # Feature de catálogos y productos
├── hooks/                      # Custom hooks globales (useAuth, useDebounce)
├── stores/                     # Estado global en Zustand (authStore, uiStore)
├── db/                         # Persistencia offline en Dexie.js (IndexedDB)
├── services/                   # Cliente Axios con interceptor W3C traceparent
├── routes/                     # Enrutador AppRoutes y ProtectedRoute
├── App.tsx                     # Componente raíz con Providers
└── main.tsx                    # Punto de entrada de la aplicación
```

---

## 3. Reglas de Componentes en Frontend

1. **100% Componentes Funcionales:**
   - Todo componente debe ser una función que utilice Hooks (`const Componente = () => { ... }` o `function Componente() { ... }`).
   - Queda prohibido el uso de clases para componentes React (`class MyComponent extends React.Component`). Las clases se reservan exclusivamente para *Error Boundaries*.
2. **Co-ubicación (*Co-location*):**
   - Cuando un componente requiera subcomponentes auxiliares o hooks exclusivos, debe empaquetarse en su propia subcarpeta con `index.ts` que exporta el componente principal.
3. **Límites de Tamaño de Archivo:**
   - Ningún archivo `.jsx` o `.tsx` debe superar las **250 líneas físicas de código** (máximo absoluto: 300 líneas).
   - Componentes grandes deben desacoplarse en subcomponentes atómicos y custom hooks.
4. **Documentación Obligatoria (DEV-STD-011):**
   - Todo componente React, vista y custom hook debe contar con bloque JSDoc estructurado en español (propósito, `@param props`, `@returns JSX.Element`).

---

## 4. Estado en Cliente y Almacenamiento Seguro
- **Estado Global:** `Zustand` con slices atómicos e inmutabilidad.
- **Almacenamiento Local Seguro:** `Dexie.js` (IndexedDB) para almacenar catálogos pesados y borradores offline sin bloquear el Event Loop.
- **Prohibición de `localStorage`:** Prohibido guardar credenciales, tokens de acceso o datos confidenciales en `localStorage` (CWE-312).

---

## 5. Estilos y Accesibilidad
- Uso consistente del sistema de diseño empresarial (Tailwind CSS o similar).
- Soporte para navegación accesible por teclado y etiquetas `aria-*` en componentes interactivos.
- Estados explícitos de interfaz: `Loading` (spinners / skeletons), `Empty` (vistas vacías ilustradas), `Error` (alertas controladas) y `Success`.
