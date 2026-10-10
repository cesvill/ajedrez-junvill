---
name: ikusi-factory
description: Orquestador y remediador autónomo de software industrial según el marco de Gobernanza Dual Ikusi 2026. Integra 8 agentes especializados con Model Tiering, 4 arquetipos de solución, 15 estándares técnicos innegociables, sensores locales AST deterministas, catálogo Lego modular (Core vs Personal) y la regla de cierre al 100% de resolución.
---

# Procedimiento Oficial de la Fábrica Autónoma de Software & Gobernanza Ikusi 2026

Cuando el usuario invoque esta Skill o solicite auditar, alinear, migrar o certificar un desarrollo:

---

## 1. Filosofía de Operación: Doble Aduana Técnica & Model Tiering

El desarrollo y certificación se ejecuta a través del pipeline autónomo de 8 agentes especializados:

1. **Orchestrator Agent:** Conductor del pipeline, gestiona handoffs y aprueba el plan técnico.
2. **Architect Agent:** Asigna el Arquetipo (`ARCH_01` a `ARCH_04`) y modulariza monolitos (< 250 líneas).
3. **Security Agent:** Aplica Ciberdefensa Bancaria (Circular SFC 007, ASVS v4.0.3, Zero Secrets, Zero localStorage).
4. **Database Agent:** Gobierna persistencia SQL-First ACID (no `SELECT *`, índices GiST, proyecciones selectivas, defer de JSONB).
5. **Backend Agent:** Servicios desacoplados Clean DDD y descarga de tareas asíncronas > 50ms a Celery/Redis.
6. **Frontend Agent:** Componentes Dumb < 300L, estado desacoplado (Zustand/Dexie.js) y semántica HTML5 accesible.
7. **QA Agent:** Pirámide de pruebas automatizadas, paridad matemática Decimal con Hypothesis y Quality Gate 100%.
8. **DevOps Agent:** Contenedores rootless hardened (UID 10001, Alpine), sondas `/healthz` y `/ready`, y K8s para ArgoCD.

---

## 2. Catálogo Modular Lego: Principio «Reciclar, Jamás Reinventar» con Privacidad Estricta

El catálogo de capacidades maestras está dividido físicamente para facilitar la colaboración sin fugas:

* **Catálogo Core (`capacidades_maestras/registry/core/`):**
  Capacidades corporativas compartibles (DLP PII en RAM, Web Login Playwright, Motor Financiero Decimal, Observabilidad OTel, Ingestión 3D, Swarm Storage, etc.).
* **Catálogo Personal (`capacidades_maestras/registry/personal/`):**
  Capacidades de uso personal o prototipos desacoplados (Autenticación familiar, emulación Joycon HID, motores voxel, frascos financieros).
* **Regla al Compartir o Exportar:**
  Al empaquetar o compartir el proyecto externamente, el catálogo `personal/` se excluye o filtra (`/api/export_blocks?scope=core`).

---

## 3. Protocolo de Inspección y Certificación en 5 Pasos

### Paso 1: Perfilado del Arquetipo de Solución
```bash
python fabrica_migrador/tools/alinear_desarrollo.py <ruta_proyecto> --profile
```

### Paso 2: Auditoría Pre-Vuelo y Línea Base
```bash
python fabrica_migrador/tools/alinear_desarrollo.py <ruta_proyecto> --audit
```
Genera la línea base en `<proyecto>/reviews/pre-audit-report.json` con los sensores AST/Regex locales a costo $0.

### Paso 3: Generación del Plan Multi-Agente
```bash
python fabrica_migrador/tools/alinear_desarrollo.py <ruta_proyecto> --plan
```
Asigna el carril de cambio (*Lane A, B o C*) y los modelos cognitivos (`flash`, `pro`, `inherit`) optimizando costos y precisión.

### Paso 4: Auto-Remediación y Cierre de Hallazgos
Los agentes refactorizan el código respetando los 15 estándares técnicos. Se aplica la **Regla Innegociable de Cierre 100%**:
```bash
python fabrica_migrador/tools/alinear_desarrollo.py <ruta_proyecto> --verify <ruta_json_linea_base>
```
*Ninguna migración se certifica si resta un solo hallazgo abierto.*

### Paso 5: Inyección de AI Governance Permanente
```bash
python fabrica_migrador/tools/alinear_desarrollo.py <ruta_proyecto> --inject-governance
```
Inyecta `ai-governance/` en el proyecto objetivo con las reglas inmutables y el pre-commit hook para blindar su evolución futura.

---

## 4. Coordinación Multi-Máquina (Computador A <-> Computador B)

Consultar siempre [`PROTOCOLO_COORDINACION_ANTIGRAVITY.md`](PROTOCOLO_COORDINACION_ANTIGRAVITY.md).
* Los proyectos locales se aíslan en `reports/audit_<id>.json` e `intakes/<id>_intake.json`.
* Los bloques Lego se registran en `capacidades_maestras/registry/core/` o `personal/`.
* Se ejecuta `pytest tests/ -v` (100% PASS requerido) antes de cualquier push a Git.
