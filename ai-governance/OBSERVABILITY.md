# Observability — Tríada OpenTelemetry (Logs, Trazas y Métricas RED)

## 1. Principio Fundamental
Todo servicio productivo backend debe implementar de manera obligatoria la **Tríada Completa de Observabilidad bajo el estándar de OpenTelemetry (OTel)**:
1. **Logs Estructurados:** Formato JSON enriquecido automáticamente con contexto de ejecución.
2. **Trazabilidad Distribuida (Distributed Tracing):** Propagación del estándar W3C Trace Context a través de peticiones HTTP, eventos asíncronos y tareas en segundo plano.
3. **Métricas RED:** Monitoreo cuantitativo continuo de Tasa de Peticiones (*Rate*), Errores (*Errors*) y Latencia/Duración (*Duration*) expuestas en formato estándar OTel / Prometheus.

Queda estrictamente prohibido el uso de `print()` o logs en texto plano sin estructura, así como desplegar servicios en producción que carezcan de un endpoint de métricas activo.

---

## 2. Los Tres Pilares de la Observabilidad OTel

### 2.1. Logs Estructurados en JSON (`structlog`)
- Salida en formato JSON parseable por FluentBit, Vector, Grafana Loki o Datadog.
- Campos mínimos obligatorios:
  - `timestamp`: Formato ISO 8601 UTC.
  - `level`: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`.
  - `service`: Nombre del servicio.
  - `trace_id` y `span_id`: Inyectados automáticamente desde el contexto OTel.
  - `event`: Descripción breve y concisa de la acción.

### 2.2. Trazabilidad Distribuida W3C (`traceparent`)
- Cada petición entrante debe propagar o generar el encabezado HTTP:
  ```text
  traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
  ```
- **Propagación a Celery:** Las tareas en cola deben recibir el `traceparent` en los encabezados del mensaje AMQP/Redis para mantener la continuidad de la traza distribuida.

### 2.3. Métricas RED y Endpoint `/metrics`
El servicio debe exponer métricas en el formato estándar OTel / Prometheus en la ruta:
```text
GET /metrics
```

Métricas mínimas requeridas:
1. **Rate (Tasa):** `http_requests_total{method, endpoint, status_code}` (Counter).
2. **Errors (Errores):** `http_exceptions_total{exception_type, endpoint}` y ratio de códigos HTTP 5xx (Counter).
3. **Duration (Duración):** `http_request_duration_seconds_bucket{method, endpoint, le}` (Histograma).

---

## 3. Sondas de Salud (Health Checks)
FastAPI debe exponer:
- `GET /healthz`: Liveness probe (verifica que el Event Loop no esté bloqueado).
- `GET /ready`: Readiness probe (ejecuta `SELECT 1` en el pool de base de datos y valida conectividad con Redis).
