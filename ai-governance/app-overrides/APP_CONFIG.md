# App Config Override

Parámetros técnicos y puertos de ejecución para este servicio:

```yaml
app:
  name: "app-service"
  environment: "test"
  ports:
    gateway: 8081
    core_api: 8002
    frontend: 5173
    metrics: 8002 # /metrics

infrastructure:
  database_url: "${DATABASE_URL}"
  redis_url: "${REDIS_URL}"
  minio_endpoint: "${MINIO_ENDPOINT}"
  minio_bucket: "${MINIO_BUCKET}"

governance:
  max_file_lines: 250
  test_coverage_threshold: 85
  explainability_language: "es"
```
