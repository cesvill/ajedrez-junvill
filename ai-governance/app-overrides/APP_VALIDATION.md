# App Validation Override

Comandos estandarizados para validación de calidad antes de entrega:

```bash
# 1. Chequeo de linters y formato
ruff check .
ruff format --check .

# 2. Chequeo de tipos estricto
mypy src --strict

# 3. Pruebas unitarias y cobertura (Umbral >= 85%)
pytest tests/ --cov=src --cov-fail-under=85

# 4. Pruebas basadas en propiedades (motores de cálculo)
pytest tests/test_properties.py

# 5. Verificación de reglas de gobernanza
python ai-governance/hooks/pre_commit_governance.py
```
