# API Contracts — Contratos de Interfaz y Tipado

## 1. Validación con Pydantic v2
- Todos los payloads de entrada y esquemas de respuesta deben modelarse con `pydantic.BaseModel`.
- Prohibido el uso de diccionarios no tipados (`dict[str, Any]`) en firmas de controladores HTTP.
- Usar uniones discriminadas para polimorfismo rápido y tipado seguro.

---

## 2. Convenciones de Rutas y Métodos HTTP
- `GET /api/v1/recurso`: Listado paginado de elementos.
- `GET /api/v1/recurso/{id}`: Detalle de un elemento específico.
- `POST /api/v1/recurso`: Creación sincrónica (`HTTP 201 Created`).
- `POST /api/v1/recurso/acciones-pesadas`: Inicio de tarea asíncrona (`HTTP 202 Accepted` con `task_id`).
- `PUT /api/v1/recurso/{id}`: Reemplazo completo.
- `PATCH /api/v1/recurso/{id}`: Actualización parcial.
- `DELETE /api/v1/recurso/{id}`: Eliminación lógica o física (`HTTP 204 No Content`).

---

## 3. Manejo Estandarizado de Errores (RFC 7807)
Todo error debe responder con estructura canónica:
```json
{
  "type": "https://api.empresa.com/errors/invalid-parameters",
  "title": "Parámetros de entrada inválidos",
  "status": 400,
  "detail": "El campo 'margen' debe ser un valor decimal entre 0 y 1.",
  "instance": "/api/v1/quotes/calculate",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```
