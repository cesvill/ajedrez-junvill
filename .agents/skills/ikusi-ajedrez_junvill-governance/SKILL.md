---
name: ikusi-ajedrez_junvill-governance
description: Protocolo formal de validación, auditoría y desarrollo gobernado para Ajedrez Junvill. Garantiza SonarQube Grado A (< 250 líneas), Zero DLP, pruebas unitarias 100% y alineación con los 15 estándares Ikusi.
---

# Ajedrez Junvill • Enterprise Governance Skill

Esta habilidad proporciona el protocolo formal de validación, auditoría y desarrollo para mantener el proyecto **Ajedrez Junvill** certificado en **5.00 / 5.00 🟢 Grado A+**.

## 1. Procedimiento de Validación Automatizada
Ejecuta el script de verificación antes de proponer cualquier cambio al usuario:
```bash
python .agent/skills/ikusi-ajedrez_junvill-governance/scripts/verify_governance.py
```

El script valida automáticamente:
1. Ningún archivo supera el límite de 250 líneas.
2. Cero secretos expuestos o bases de datos trackeadas en Git (Zero DLP).
3. Respeto al marco inmutable en `ai-governance/`.
4. Ejecución exitosa de pruebas unitarias.
