# App Deployment Override

Parámetros de despliegue sobre Kubernetes y ArgoCD:

- **Namespace:** `test`
- **Registro de Contenedores:** `harbor.empresa.com/apps/`
- **Aplicación ArgoCD:** `app-service-test`
- **Ingress Host:** `https://app-test.empresa.com`
- **Estrategia de Actualización:** `RollingUpdate` (maxSurge: 1, maxUnavailable: 0)
- **Sondas de Salud:**
  - Liveness: `/healthz`
  - Readiness: `/ready`
- **Métricas:**
  - Scraping activo en `/metrics` cada 15 segundos.
