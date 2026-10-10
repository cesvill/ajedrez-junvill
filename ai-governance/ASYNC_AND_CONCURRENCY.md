# Async and Concurrency — Gobernanza de Asincronismo y Concurrencia

## 1. Protección del Event Loop
- **Prohibición de Bloqueos:** Nunca invocar funciones síncronas bloqueantes dentro de corrutinas `async def`.
- **Alternativas No Bloqueantes:**
  - `time.sleep()` $\rightarrow$ `asyncio.sleep()`
  - `requests.get()` $\rightarrow$ `httpx.AsyncClient().get()`
  - `open()` en archivos pesados $\rightarrow$ `aiofiles` o delegar a workers.

---

## 2. Regla de los 50 Milisegundos y Workers Celery
- Cualquier operación pesada que tome más de **50ms** (generación de Excel con OpenPyXL, renderizado de PDFs, exportaciones masivas, compresión de archivos, procesamiento de imágenes) **NO debe ejecutarse en el proceso web de la API**.
- Debe publicarse como una tarea diferida hacia **Celery** respaldado por **Redis Broker**:

```python
# Adaptador Inbound FastAPI:
@router.post("/exportar-excel", status_code=202)
async def solicitar_exportacion(quote_id: UUID, current_user = Depends(get_current_user)):
    task = export_quote_excel_task.delay(str(quote_id))
    return {"task_id": task.id, "status": "processing"}
```

---

## 3. Prevención de Deadlocks y Manejo de Concurrencia en BD
- En transacciones que involucren múltiples registros, el bloqueo (`FOR UPDATE`) debe realizarse en **orden determinista** (ordenando siempre por clave primaria ascendente: `ORDER BY id ASC`).
- Utilizar transacciones de corta duración para minimizar la ventana de bloqueo de tablas y filas.
