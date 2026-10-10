# Database Migrations — Migraciones Alembic y Concurrencia K8s

## 1. Reglas de Ejecución en Kubernetes
- Las migraciones de Alembic **nunca se ejecutan en los hilos de arranque de los pods web de la API**.
- Se ejecutan en un **Init Container** dedicado antes de que los pods comiencen a atender tráfico.

---

## 2. Prevención de Concurrencia con `pg_advisory_lock`
- En entornos con múltiples réplicas de pods o pipelines paralelos, se debe garantizar que una sola instancia ejecute la migración mediante bloqueos consultivos de PostgreSQL (`pg_advisory_lock`).

---

## 3. Reversibilidad y Rollback
- Toda migración incremental generada (`alembic/versions/xxxx_upgrade.py`) debe contar con su correspondiente bloque `downgrade()` probado y validado.
- Quedan prohibidas las sentencias destructivas (`DROP TABLE`, `DROP COLUMN`) en caliente sin un plan de migración por fases (*Expand and Contract*).
