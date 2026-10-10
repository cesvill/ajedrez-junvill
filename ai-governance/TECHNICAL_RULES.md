# Technical Rules — Reglas Técnicas Innegociables

Este documento resume las reglas operativas obligatorias para cualquier código desarrollado o mantenido en el proyecto.

---

## 1. Modularidad, Tamaño de Archivo y Regla Anti-Chopping (ARCH-STD-002.1)
- **Límite Estricto:** Ningún archivo de código fuente (.py, .ts, .tsx, .js, .jsx) debe superar las **250 líneas físicas**.
- **Prohibición de File-Chopping:** Vetado terminantemente crear archivos secuenciales numerados (`part1.py`, `rules_part2.py`, `chunk_3.ts`). La modularización debe responder a separación por dominio de negocio (DDD, Strategy, Handlers, Registry).
- **Clausura Formal de Variables Libres:** Cero variables huérfanas en AST (previene `UnboundLocalError`). Prohibido pasar diccionarios amorfos `ctx: dict`; usar `@dataclass(frozen=True)` o esquemas Pydantic inmutables (`RuleContext`).
- **Escudo Anti-Regresiones:** Todo cambio debe ser evaluado y aprobado por `regression_gate.py` antes de merge o certificación.
- Queda prohibido el antipatrón "God Object".

---

## 2. Explicabilidad y Documentación Obligatoria de Componentes ("Why over What")
- **Backend:** Toda función, clase pública, servicio, endpoint y repositorio debe contar con docstring en formato Google Style en **idioma español**.
- **Frontend:** Todo componente React (`.jsx`, `.tsx`), vista, custom hook (`useX`) y store debe incluir obligatoriamente documentación JSDoc/TSDoc en **idioma español** antes de su declaración (propósito de negocio, props, callbacks y retorno JSX).
- La documentación debe explicar el **por qué** existe el componente y sus premisas de negocio, no solo repetir la firma sintáctica.
- Marcador obligatorio `# OJO HUMANO:` / `// OJO HUMANO:` en decisiones de riesgo (timeouts, seguridad, mitigaciones, redondeo financiero, hacks de UI).
- **Cero Código Zombie:** Prohibido dejar bloques de código comentado inactivo en backend y frontend.

---

## 3. Asincronismo y Event Loop
- Prohibidas las llamadas síncronas bloqueantes (`time.sleep()`, `requests.get()`, I/O masivo en disco) dentro de corrutinas `async def`.
- Toda operación con duración estimada $> 50$ milisegundos (exportación de Excel, reportes PDF, procesamiento de imágenes) debe delegarse a **Celery + Redis**.

---

## 4. Gobernanza de Base de Datos y Consultas
- **CERO `SELECT *`:** Consultar únicamente las columnas estrictamente necesarias o proyectar a DTOs.
- En tablas con atributos voluminosos (JSON, JSONB, TEXT, BLOB), aplicar obligatoriamente `.options(defer(Model.column))`.
- Todo endpoint de listado debe implementar paginación determinista (`limit`, `offset` o keyset).
- Migraciones ejecutadas exclusivamente en Init Containers con `advisory_lock`.

---

## 5. Ciberdefensa y Manejo de Secretos
- Cero contraseñas, api keys, tokens o certificados quemados en código fuente.
- Extracción vía variables de entorno tipadas (`pydantic-settings`).
- Erradicación de `localStorage` para tokens de sesión y datos confidenciales (usar cookies `HttpOnly` o Dexie.js).
- Contenedores Docker multi-stage sobre Alpine, ejecutando bajo usuario no privilegiado `10001` (`appuser`) bajo Pod Security Standards Restricted.

---

## 6. Observabilidad Integral OpenTelemetry
- Cero `print()` en código productivo; uso exclusivo de logs JSON estructurados (`structlog`).
- Propagación de trazabilidad distribuida W3C mediante encabezados `traceparent`, transmitidos también a Celery.
- Exposición obligatoria de métricas RED en el endpoint `GET /metrics`.
