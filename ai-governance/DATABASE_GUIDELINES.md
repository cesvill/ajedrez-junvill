# Database Guidelines — Gobernanza de Base de Datos y Consultas

## 1. Proyecciones Selectivas y Erradicación de `SELECT *`
- **Cero `SELECT *`:** Queda prohibido emitir consultas no proyectadas.
- En SQLAlchemy, si se consulta una entidad con columnas voluminosas (`JSON`, `JSONB`, `TEXT`), se debe usar `defer()`:
  ```python
  stmt = select(QuoteModel).options(defer(QuoteModel.snapshot_data)).where(QuoteModel.id == quote_id)
  ```
- Para listados y tablas resumen, proyectar exclusivamente a tuplas o DTOs livianos.

---

## 2. Paginación Determinista
- Ningún endpoint de colección debe responder sin límites.
- Exigir `PaginationParams` (`limit=50`, `max_limit=100`, `offset=0`).
- En tablas con más de 100k registros, utilizar paginación basada en cursor (*Keyset pagination*).

---

## 3. Manejo de Conexiones y Pooling K8s
- `pool_pre_ping = True`: Valida el estado de la conexión antes del checkout para evitar excepciones por socket caído.
- `pool_recycle = 1800`: Recicla conexiones cada 30 minutos.
- `expire_on_commit = False`: Evita errores de lazy loading asíncrono.
