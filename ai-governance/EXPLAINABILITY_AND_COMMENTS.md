# Explainability and Comments — Gobernanza de Explicabilidad

## 1. Filosofía Central: "Explain Why, Not What"
El código debe explicar las razones de negocio y las decisiones técnicas complejas que lo motivan. La sintaxis del lenguaje ya dice *qué* hace el código; los comentarios y docstrings deben aclarar *por qué* se eligió esa solución y *cuáles* son sus premisas y riesgos.

**Todos los componentes de software (Backend y Frontend)** deben contar con documentación estructurada en su cabecera en **idioma español**.

---

## 2. Backend: Docstrings Google Style en Español
Toda función, clase, servicio y repositorio público en Python debe estructurarse así:

```python
def procesar_liquidacion_lote(
    lote_id: UUID,
    aplicar_tasa_preferencial: bool = False
) -> ResultadoLiquidacionDTO:
    """Ejecuta la liquidación transaccional de un lote de cotizaciones pendientes.

    Agrupa las órdenes por cliente y calcula los subtotales aplicando el motor
    de redondeo contable ROUND_HALF_UP para evitar discrepancias de centavos.
    Las transacciones se confirman en lotes de 100 registros para evitar bloqueos
    extensos en la tabla principal de liquidaciones.

    Args:
        lote_id: Identificador único UUID del lote a liquidar.
        aplicar_tasa_preferencial: Indica si se debe aplicar la tasa bonificada corporativa.

    Returns:
        ResultadoLiquidacionDTO con el consolidado monetario y la lista de comprobantes.

    Raises:
        LoteNoEncontradoError: Si el lote_id no existe en base de datos.
        TransaccionInvalidaError: Si el lote ya fue liquidado previamente o está cancelado.
    """
```

---

## 3. Frontend: Documentación de Componentes React y Hooks (JSDoc en Español)
**Todo componente React (`.jsx`, `.tsx`), vista, hook personalizado y store** debe incluir obligatoriamente un bloque JSDoc estructurado antes de su declaración:

```tsx
/**
 * Componente que renderiza el panel de cotizaciones activas del cliente.
 *
 * Muestra el desglose de productos y tiempos de entrega delegando los cálculos
 * al backend headless. Gestiona estados de carga (skeletons) y errores.
 *
 * @param props.cotizacionId - Identificador único UUID de la cotización.
 * @param props.esSoloLectura - Bandera que inhabilita las acciones de edición.
 * @param props.onConfirmar - Callback invocado tras la confirmación de compra.
 * @returns Nodo JSX con el formulario y las tablas de desglose.
 */
export const PanelCotizacionCliente = ({ cotizacionId, esSoloLectura, onConfirmar }: Props) => {
  // ...
};
```

---

## 4. Marcador `# OJO HUMANO:` / `// OJO HUMANO:`
Obligatorio en:
- Timeouts y límites de reintentos con proveedores externos.
- Algoritmos financieros y redondeos monetarios.
- Manejo de llaves criptográficas, firmas HMAC y tokens.
- Consultas SQL con bloqueos explícitos (`FOR UPDATE`).
- Workarounds en UI o hacks de renderizado en React.

---

## 5. Política Anti-Código Zombie
- Queda prohibido versionar líneas o bloques de código comentado.
- Si un método o componente ya no se usa, debe eliminarse completamente; el historial de Git preservará los cambios históricos.
