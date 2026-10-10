# Start Here — AI Governance Framework

Bienvenido al sistema de gobierno continuo de la **Fábrica Autónoma de Software**.

Este framework asegura que cualquier desarrollo de software (tanto proyectos migrados como desarrollos greenfield) mantenga alineación estricta con la arquitectura empresarial, calidad de código y ciberdefensa sin desviaciones (*anti-drift*).

---

## 1. Principio Fundamental: Aprobación Única y Ejecución Autónoma

> **El usuario humano aprueba el plan técnico una sola vez al inicio del requerimiento. A partir de esa aprobación, los agentes especializados colaboran entre sí de forma autónoma mediante traspasos de contexto (*handoffs*) y bucles de autocorrección (*self-healing*) hasta completar el 100% del requerimiento.**

---

## 2. Regla Innegociable de Cierre (100% Resolución)

> [!IMPORTANT]
> **Ningún requerimiento o migración puede darse por cerrado, calificado ni certificado (5.00/5.00 Grado A+) mientras exista un solo hallazgo abierto o no resuelto identificado durante la fase de análisis.**

---

## 3. Topología de Agentes Especializados

1. **Orchestrator Agent:** Director de orquesta, valida dependencias, coordina entregables y gestiona el bucle de auto-remediación.
2. **Architect Agent:** Análisis y diseño técnico (`02-technical-design.md`), perfilado de arquetipos y límites modulares ($\le 250$ líneas).
3. **Database Agent:** Modelado relacional (`03-data-design.md`), migraciones reversibles, índices y proyecciones selectivas (CERO `SELECT *`, `defer()` en JSONB).
4. **Backend Agent:** Implementación Clean Hexagonal DDD, offloading de tareas pesadas a Celery/Redis, observabilidad OpenTelemetry (logs, trazas W3C y métricas RED) y docstrings en español.
5. **Frontend Agent:** Interfaces React modulares ($< 300$ líneas), Zustand, Dexie.js (IndexedDB), cero `localStorage` y cero lógica financiera en el cliente (*dumb client*).
6. **QA Agent:** Verificación de cobertura ($\ge 85\%$), pruebas basadas en propiedades (Hypothesis) y certificación del **Gate 100% de Resolución de Hallazgos**.
7. **Security Agent:** Auditoría OWASP ASVS v4.0.3, SFC 007, Cero Secretos y poder de veto absoluto.
8. **DevOps Agent:** Despliegue GitOps en Kubernetes (Harbor + ArgoCD) restringido al entorno `test`. Cero despliegues directos a producción.

---

## 4. Instrucción de Arranque Rápido para el Desarrollador o LLM

Cuando solicites un cambio o nueva funcionalidad, inicia con el siguiente prompt:

```text
Lee ai-governance/START_HERE.md y ai-governance/MASTER_PROMPT.md.

Quiero solicitar este requerimiento:
[Descripción clara de la funcionalidad o necesidad de negocio]
```
