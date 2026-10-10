# ==============================================================================
# IKUSI ENTERPRISE AI GOVERNANCE MASTER LAWS (GEMINI.md / AGENTS.md)
# Proyecto: Ajedrez Junvill • Ecosistema Fábrica de Software Ikusi 2026
# Rol: Agente Especializado y Certificador de Calidad Grado A+ (5.00/5.00)
# ==============================================================================

Este espacio de trabajo forma parte del portafolio industrial de la Fábrica Autónoma de Software y Gobernanza Ikusi 2026.
Cualquier asistente de IA (Antigravity, Cursor, Claude, Copilot, ChatGPT) o desarrollador que opere en este repositorio DEBE cumplir de forma incondicional las siguientes directivas inquebrantables:

## 1. TOPOLOGÍA DE AGENTES Y MODEL TIERING
1. Operación coordinada mediante los 8 agentes especializados: Orchestrator, Architect, Security, Database, Backend, Frontend, QA y DevOps.
2. Model Tiering: Tareas complejas o de remediación en `pro`, análisis rápido/escaneos en `flash`, scripts locales en Python AST a costo $0.

## 2. REGLA INNEGOCIABLE DE CIERRE AL 100%
- Ninguna remediación o certificación se da por concluida si resta un solo hallazgo abierto.
- La verificación con las pruebas unitarias y el script de gobernanza (`python .agent/skills/ikusi-ajedrez_junvill-governance/scripts/verify_governance.py`) debe arrojar 100% aprobadas antes de cualquier entrega o push.

## 3. CATÁLOGO MODULAR LEGO (CORE VS PERSONAL)
- Reutilización de bloques maestros: consulta siempre el catálogo transversal antes de reinventar funcionalidades.
- Privacidad estricta: cero secretos en texto plano (SEC-STD-001) y cero almacenamiento sensible en localStorage (CWE-312).

## 4. INYECCIÓN DE REGLAS ALWAYS-ON
- El repositorio mantiene sincronizado `ai-governance/` y su skill local en `.agent/skills/`.
- El desarrollador NO necesita proporcionar prompts manuales en nuevos chats: Antigravity inyecta las directivas de forma incondicional.

## 5. PROHIBICIÓN DE FILE-CHOPPING Y CLAUSURA DETERMINISTA (ARCH-STD-002.1)
- Prohibición de Troceo Numérico: Queda estrictamente vetado crear archivos tipo `part1.py`, `part2.py`, etc. La modularización (< 250L) debe responder a separación por dominio (Strategy, DDD, Handlers).
- Clausura de Variables Libres: Cero variables huérfanas en AST. Prohibido pasar diccionarios genéricos `ctx: dict`; usar `@dataclass` o modelos tipados inmutables.
- Escudo Anti-Regresiones: Todo refactor debe superar el Regression Gate determinista antes de cantar victoria.
