# Semantic Organization and Component Reuse — Semántica y Reutilización DRY

Este documento establece las reglas obligatorias de semántica de código, accesibilidad nativa y estrategias de reutilización tanto para Frontend como para Backend.

---

## 1. Organización Semántica en Frontend (HTML5 & a11y)

### 1.1. Erradicación de la "Divitis"
Queda estrictamente prohibido utilizar elementos neutros `<div>` o `<span>` para estructuras que tienen equivalentes semánticos nativos en HTML5:

- **Botones y Acciones:** Prohibido `<div onClick={...}>`. Usar obligatoriamente `<button type="button" onClick={...}>` para garantizar soporte por teclado (Enter, Espacio) y lectores de pantalla.
- **Estructura de la Página:** Usar `<main>`, `<header>`, `<nav>`, `<aside>`, `<footer>`.
- **Bloques de Contenido:** Usar `<article>` y `<section>`.
- **Estructuras Tabulares:** Usar `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`. Prohibido simular tablas con divs flotantes.

### 1.2. Nomenclatura Semántica Limpia
- **Componentes:** `[Rol][Contexto][Tipo]` (ej. `ModalConfirmacionEliminar`, `TablaPartidasCotizacion`). Prohibidos nombres ambiguos (`Box`, `Wrapper`, `Container`).
- **Funciones:** Verbo de acción + Sustantivo de negocio (ej. `calcularMargenVenta()`, `obtenerHistoricoPrecios()`).
- **Booleanos:** Prefijos interrogativos explícitos (`estaActivo`, `puedeEditar`, `esSoloLectura`, `estaCargando`).

---

## 2. Gobernanza de Reutilización de Componentes (DRY)

### 2.1. La Regla de Tres (Rule of Three)
- Si un componente o patrón visual se repite 2 veces, se permite mantenerlo en su módulo local (`features/<feature>/components/`).
- **A la tercera repetición, es mandatorio extraerlo** a la biblioteca de componentes compartidos (`components/ui/` o `components/feedback/`).

### 2.2. Prohibición de Duplicación por Variantes (Anti-Forking)
- Prohibido crear copias de un componente para cambiar color o tamaño (ej. `BotonVerde.tsx`, `BotonRojo.tsx`).
- Se debe unificar en un único componente paramétrico con props tipadas (`variant: 'primary' | 'danger'`, `size: 'sm' | 'md'`).

### 2.3. Composición sobre Herencia (Compound Components)
- En lugar de saturar un componente con decenas de boolean props (`hasHeader`, `isCompact`, `showFooter`), utilizar composición:
  ```tsx
  <Card>
    <Card.Header title="Resumen Financiero" />
    <Card.Body>
      <GraficoRentabilidad data={data} />
    </Card.Body>
    <Card.Footer>
      <Button variant="secondary">Cerrar</Button>
    </Card.Footer>
  </Card>
  ```

---

## 3. Reutilización en Backend

1. **Clases Base Genéricas:** Operaciones CRUD comunes se heredan de `GenericRepository[T]`.
2. **Value Objects Universales:** Conceptos como `Money` y `DateRange` se centralizan en `domain/value_objects/`.
3. **Lógica Transversal:** Autenticación, trazas W3C, auditoría y rate-limiting se implementan como Middlewares reutilizables de FastAPI.
