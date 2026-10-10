# Architecture — Clean Hexagonal Domain-Driven Design & Estructura Backend

## 1. Topología de Capas (Ports and Adapters)

```
[ PRESENTATION ]  --> FastAPI Routers / Controllers / DTOs Pydantic v2
        │
        ▼
[ APPLICATION ]   --> Casos de Uso / Servicios de Aplicación / Puertos / Unit of Work
        │
        ▼
[ DOMAIN ]        --> Modelos de Negocio / Value Objects / Excepciones / typing.Protocol
        ▲
        │
[ INFRASTRUCTURE] --> SQLAlchemy 2.0 Async / Repositorios / Celery / MinIO S3 / OTel
```

### Reglas de Dependencia
- La capa de **Domain** no conoce ni depende de ninguna tecnología externa (prohibido importar FastAPI, SQLAlchemy, Pydantic o librerías de red dentro de `src/domain/`).
- La capa de **Application** coordina el dominio y define puertos (`typing.Protocol`).
- La capa de **Infrastructure** implementa los puertos definidos por la aplicación o dominio.
- La capa de **Presentation** traduce peticiones externas hacia llamadas a la capa de aplicación.

---

## 2. Organización Jerárquica de Carpetas Backend (`src/`)

```text
src/
├── presentation/               # Capa de Entrada (HTTP / Routers / Schemas)
│   └── api/v1/
│       ├── routes/             # Endpoints FastAPI delgados
│       └── dependencies.py     # Inyección de dependencias (Depends)
│   └── schemas/                # Modelos Pydantic v2 (DTOs de entrada y salida)
├── application/                # Capa de Orquestación y Casos de Uso
│   ├── services/               # Clases de servicio de aplicación
│   ├── ports/                  # Interfaces abstractas (typing.Protocol)
│   └── uow.py                  # Interfaz Unit of Work
├── domain/                     # Núcleo Puro de Dominio
│   ├── models/                 # Entidades y agregados (dataclasses)
│   ├── value_objects/          # Objetos de valor inmutables (Money, Percentage)
│   └── exceptions.py           # Jerarquía de excepciones de negocio
└── infrastructure/             # Adaptadores Concretos
    ├── persistence/            # SQLAlchemy 2.0 Async, repositorios concretos
    ├── storage/                # Cliente MinIO S3
    ├── cache/                  # Cliente Redis
    ├── workers/                # Tareas Celery (offloading > 50ms)
    └── telemetry/              # OTel structlog, W3C tracer, /metrics
```

---

## 3. Gobernanza de Clases (POO) vs Funciones en Backend

### Uso Obligatorio de Clases:
1. **Entidades y Agregados:** Clases con identidad que encapsulan reglas e invariantes de negocio (`@dataclass`).
2. **Value Objects:** Clases inmutables (`@dataclass(frozen=True)`) para magnitudes (ej. `Money`).
3. **Puertos y Contratos:** Clases abstractas con `typing.Protocol` para desacoplar infraestructura.
4. **Servicios de Aplicación y Repositorios:** Clases que reciben dependencias inyectadas en `__init__`.
5. **Excepciones de Dominio:** Jerarquía de excepciones derivadas de `Exception`.

### Uso de Funciones Puras:
1. **Rutas HTTP (FastAPI):** Funciones `async def endpoint(...)` decoradas por el router.
2. **Mapeadores y Transformadores:** Funciones sin estado que convierten entre DTOs y entidades.
3. **Utilidades:** Hashing, sanitización o conversiones matemáticas puras.

---

## 4. Límites, Modularidad y Regla Anti-Chopping (ARCH-STD-002.1)
- Cada módulo debe tener una sola responsabilidad técnica y funcional.
- Si un archivo supera las 200 líneas, debe dividirse proactivamente.
- Archivos mayores a **250 líneas físicas** son rechazados automáticamente por el Quality Gate.
- **Prohibición Estricta de File-Chopping:** Vetado crear archivos secuenciales numerados (`part1.py`, `rules_part2.py`, `chunk_3.ts`). La modularización debe responder a separación por dominio DDD (Strategy, Handlers, Registry, Domain Services).
- **Clausura Formal de Variables Libres:** Toda función extraída debe recibir sus dependencias formalmente tipadas. Prohibido pasar diccionarios genéricos `ctx: dict`; usar `@dataclass(frozen=True)` para contextos inmutables (`RuleContext`).
- **Verificación AST Pre-Commit:** Cero variables libres no vinculadas (previniendo UnboundLocalError / NameError).
