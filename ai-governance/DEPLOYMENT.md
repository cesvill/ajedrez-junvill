# Deployment — Despliegue en Kubernetes, Harbor y ArgoCD

## 1. Alcance y Entorno de Despliegue
- Todo despliegue ejecutado por la Fábrica o los agentes especializados está estrictamente restringido al entorno **`test`** sobre el clúster de Kubernetes corporativo.
- **Prohibición Absoluta:** Queda terminantemente prohibido el despliegue directo a ambientes de producción desde pipelines autónomos. La promoción a producción requiere autorización formal del comité de cambios y pipeline manual de release.

---

## 2. Flujo GitOps con Harbor y ArgoCD
1. **Construcción y Firma:** Docker multi-stage construye la imagen Alpine y la publica en el registro privado corporativo **Harbor**.
2. **Sincronización GitOps:** ArgoCD detecta la actualización del tag en el repositorio de manifiestos y sincroniza el estado deseado en el namespace `test`.

---

## 3. Especificación Pod Security Standards "Restricted"
Los pods desplegados deben cumplir estrictamente el contexto de seguridad restringido:
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  fsGroup: 10001
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop:
      - ALL
```

---

## 4. Init Containers para Migraciones de Base de Datos
Las migraciones de Alembic se declaran en el bloque `initContainers` del Deployment:
```yaml
initContainers:
  - name: db-migrations
    image: harbor.empresa.com/apps/core-api:tag
    command: ["alembic", "upgrade", "head"]
    envFrom:
      - secretRef:
          name: db-credentials
```

---

## 5. Sondas de Salud y Monitoreo Prometheus
```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 15

readinessProbe:
  httpGet:
    path: /ready
    port: 8000
  initialDelaySeconds: 15
  periodSeconds: 10

# Anotaciones para raspado de métricas OTel / Prometheus:
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8000"
    prometheus.io/path: "/metrics"
```

---

## 6. Topología Canónica Desacoplada de 4 Capas en Contenedores (DEVOPS-STD-002)

Para arquetipos Web Multicapa (ARCH_01), el empaquetado y orquestación local/industrial exige una arquitectura estrictamente desacoplada de 4 servicios:

1. **`frontend` (Nginx Alpine):** Despacha vistas HTML y activos estáticos directamente con compresión gzip y cabeceras de seguridad (`SEC-STD-005`). Expone `${HOST_PORT:-5000}:80`. Redirige `/api/*` y `/metrics` a la capa Gateway.
2. **`gateway` (Python / Gunicorn :5002):** API Gateway / BFF (`SEC-STD-006`). Gestiona exclusivamente cookies seguras `HttpOnly`. Emite tokens M2M JWT Bearer firmados internamente hacia el backend. Aislado en red interna.
3. **`backend` (Python / Gunicorn :5001):** Motor de cálculo y dominio de negocio. Valida tokens criptográficos Bearer en cada petición. Acceso transaccional exclusivo a la persistencia.
4. **`db` (PostgreSQL 16 Alpine :5432):** Persistencia relacional con volúmenes dedicados (`postgres_data`) y sondeo de salud mediante `pg_isready`.

