# SonarQube — Quality Gate de Mantenibilidad y Seguridad

## 1. Criterios del Quality Gate Enterprise
Para superar el Quality Gate de SonarQube en el pipeline de CI/CD:
1. **0 Vulnerabilities:** Cero fallos de seguridad (CWE-798, CWE-89, CWE-312, CWE-598).
2. **0 Bugs:** Cero errores de ejecución detectados estáticamente.
3. **0 Security Hotspots sin revisar:** 100% de los hotspots deben estar revisados y justificados con `# OJO HUMANO:`.
4. **Maintainability Rating A:** Deuda técnica $< 5\%$.
5. **Duplicación de Código:** $< 3\%$ de líneas duplicadas.
6. **Complejidad Cognitiva:** Máximo 15 puntos por función o método.

---

## 2. Configuración en `sonar-project.properties`
```properties
sonar.projectKey=fabrica-software-service
sonar.sources=src
sonar.tests=tests
sonar.python.coverage.reportPaths=coverage.xml
sonar.python.version=3.11
sonar.exclusions=**/migrations/**,**/node_modules/**,**/dist/**
```
