# QA — Aseguramiento de Calidad y Quality Gates

## 1. Regla Innegociable de Cierre: 100% de Hallazgos Resueltos
> **Una migración o requerimiento NO puede darse por cerrado ni certificado (5.00/5.00 Grado A+) hasta que el 100% de los hallazgos identificados en el análisis pre-audit hayan sido verificados como resueltos por el QA Agent.**

Si queda incluso un solo hallazgo abierto (ej. una consulta sin `defer()`, una función pública sin docstrings, un archivo con 252 líneas o falta del endpoint `/metrics`), el requerimiento es devuelto inmediatamente al ciclo de auto-remediación multi-agente.

---

## 2. Cobertura de Pruebas Automatizadas
- **Umbral Mínimo:** Cobertura de código $\ge \mathbf{85\%}$ medida con `pytest-cov`.
- Toda nueva lógica de negocio, servicio de dominio o transformador de datos debe incluir pruebas unitarias.
- Pruebas de integración sobre adaptadores de base de datos y clientes externos usando Testcontainers o bases de prueba en memoria.

---

## 3. Pruebas Basadas en Propiedades (Hypothesis)
Para motores de cálculo, pricing, cotizaciones o algoritmos financieros:
- Las pruebas con datos fijos son insuficientes.
- Se exige el uso de `Hypothesis` con un mínimo de **1,000 iteraciones deterministas** para validar invariantes y paridad matemática frente a modelos contables/Excel (`ROUND_HALF_UP`).

---

## 4. Aduana 3: Verificación Dinámica E2E en Vivo y Playwright (QA-STD-005)
- Las pruebas en memoria son condición necesaria pero no suficiente.
- La aplicación debe levantarse en un socket HTTP real (`alinear_desarrollo.py --verify-e2e`).
- Debe demostrar:
  1. 100% de vistas HTML respondiendo con código HTTP 200.
  2. 100% de scripts y estilos CSS cargando sin errores 404 ni 500.
  3. Cero excepciones JavaScript no controladas en la consola del navegador.
  4. Renderizado exitoso del DOM auditado con Playwright Chromium Headless (1440x900).

---

## 5. Matriz de Certificación y Grado de Calidad

| Calificación | Grado | Condición | Estado de Entrega |
|---|---|---|---|
| **5.00 / 5.00** | **Grado A+** | **100% hallazgos resueltos**, cobertura $\ge 85\%$, Aduana 3 E2E aprobada, cero vulnerabilidades SonarQube | **Certificado y Aprobado para Despliegue** |
| 4.00 - 4.99 | Grado B | Menos del 100% resuelto, fallo en Aduana 3 o cobertura entre 75% y 84% | **Rechazado - En Auto-Remediación** |
| < 4.00 | Grado C / F | Fallas de arquitectura, seguridad o cobertura insuficiente | **Rechazado - Bloqueado** |
