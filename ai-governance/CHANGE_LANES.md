# Change Lanes — Clasificación y Gobierno de Cambios

Para garantizar agilidad sin comprometer la seguridad ni la estabilidad de la plataforma, todo requerimiento debe clasificarse en uno de los tres carriles de cambio:

---

## 1. Lane A: Cambio Mayor / Migración Integral

### Criterios de Aplicación
- Nuevos módulos o microservicios.
- Migración de proyectos legados o vibe-coded.
- Modificaciones al modelo de datos o esquemas relacionales.
- Cambios en mecanismos de autenticación, autorización o contratos de API públicos.
- Tareas asíncronas pesadas que requieren arquitectura Celery/Redis o MinIO S3.

### Flujo Obligatorio
1. Aprobación única del plan por parte del usuario.
2. Involucramiento completo de los 8 agentes especializados.
3. Actualización de documentación de arquitectura de sistema (`CURRENT_ARCHITECTURE.md`, `SYSTEM_EVOLUTION.md`).
4. Quality Gate QA con cobertura $\ge 85\%$ y cumplimiento del 100% de hallazgos pre-audit.
5. Veto de seguridad obligatorio (`Security Agent`).
6. Despliegue en Kubernetes (Harbor + ArgoCD) en entorno `test`.

---

## 2. Lane B: Mejora Estándar / Refactorización Cohesiva

### Criterios de Aplicación
- Nuevos endpoints o casos de uso dentro de módulos existentes.
- Refactorización de componentes para cumplir la regla de 250 líneas.
- Optimización de consultas ORM (proyecciones selectivas, `defer()`).
- Nuevas pantallas o flujos en el frontend respetando contratos vigentes.

### Flujo Obligatorio
1. Aprobación del plan por el usuario.
2. Intervención de Architect, Backend/Frontend, QA y Seguridad (si aplica).
3. Pruebas unitarias de los nuevos casos de uso con cobertura local $\ge 85\%$.
4. Revisión focalizada de QA y Security.

---

## 3. Lane C: Hotfix / Corrección Menor

### Criterios de Aplicación
- Corrección de bugs menores de UI o formato.
- Ajuste de textos, etiquetas o docstrings.
- Actualización de variables de entorno no sensibles en `.env.example`.

### Flujo Obligatorio
1. Validación rápida de no regresión.
2. Verificación estática con linters (Ruff/Mypy).
3. Confirmación de Cero Secretos.
