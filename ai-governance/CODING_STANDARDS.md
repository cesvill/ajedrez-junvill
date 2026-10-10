# Coding Standards — Estándares de Codificación Enterprise

## 1. Python (Backend & Workers)
- **Versión Mínima:** Python 3.11+.
- **Tipado Estricto:** Type hints completos en todos los argumentos y retornos (`mypy` en modo `strict`).
- **Linter & Formatter:** `Ruff` con reglas corporativas activas (Black, Flake8, Isort, Bandit).
- **Límite de Líneas:** Máximo 250 líneas por archivo.
- **Prohibición de File-Chopping (ARCH-STD-002.1):** Prohibido trocear archivos en rodajas secuenciales (`part1.py`, `rules_part2.py`). Modularización estricta por dominio/estrategia.
- **Clausura Formal de Variables Libres:** 0 variables huérfanas en AST (previene `UnboundLocalError`). Prohibido pasar diccionarios amorfos `ctx: dict`; usar `@dataclass(frozen=True)` o esquemas Pydantic inmutables.
- **Testing & Regression Gate:** `pytest`, `pytest-asyncio`, `pytest-cov` con cobertura mínima obligatoria de **85%** y validación previa con `regression_gate.py`.

## 2. TypeScript / JavaScript (Frontend)
- **Framework:** React 18+ con TypeScript o JSX modular.
- **Estado:** Zustand con slices atómicos. Prohibidos contextos monolíticos globales gigantescos.
- **Persistencia en Cliente:** Dexie.js (IndexedDB) para catálogos y drafts offline. Prohibido `localStorage` para tokens.
- **Cliente Tonto (Dumb Client):** Cero cálculos de márgenes, impuestos o pricing en el navegador.

## 3. SQL & Persistencia
- **ORM:** SQLAlchemy 2.0 en modo asíncrono (`AsyncSession`).
- **Convención de Nombres:** `snake_case` plural para tablas, `snake_case` singular para columnas.
- **Proyecciones:** Exigencia de `defer()` en columnas JSON/JSONB o proyecciones explícitas de atributos. Prohibido `SELECT *`.
- **Transacciones:** Cortas, atadas al ciclo de petición HTTP con Unit of Work (UoW).

## 4. Estilo de Documentación
- Docstrings en formato Google Style redactados en **español**.
- Secciones: Propósito, Args, Returns, Raises.
- Marcador `# OJO HUMANO:` en decisiones de riesgo técnico.
- Cero código muerto comentado.
