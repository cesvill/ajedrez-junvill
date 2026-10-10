# Security — Ciberdefensa y Gobernanza AppSec

## 1. Cumplimiento Normativo
Todo desarrollo debe apegarse a los lineamientos de la **Circular 007 de la SFC** y **OWASP ASVS v4.0.3 (Nivel 2/3)**.

---

## 2. Gestión de Secretos y Configuración
- Prohibición absoluta de credenciales o API keys en código fuente (CWE-798).
- Uso obligatorio de `.env.example` con placeholders documentados.
- Inyección en runtime vía variables de entorno tipadas (`pydantic-settings`).

---

## 3. Seguridad de Autenticación y Sesiones
- **Dual-Token Pattern:** Token de acceso de corta duración (15 min) en memoria RAM del cliente; token de refresco en cookie con flags `HttpOnly; Secure; SameSite=Strict`.
- **Cero Tokens en Query Params:** Prohibido pasar tokens o llaves API por la URL (`?token=` o `?key=`, CWE-598).
- **Cero `localStorage`:** Prohibido guardar datos sensibles o credenciales en el almacenamiento local del navegador (CWE-312).

---

## 4. Seguridad de Infraestructura y Contenedores
- Perfil **Restricted** de Pod Security Standards de Kubernetes.
- Ejecución bajo usuario no privilegiado `10001` (`appuser`).
- Sistema de archivos raíz de solo lectura (`readOnlyRootFilesystem: true`).
- Eliminación de compiladores y herramientas de compilación de la imagen productiva final.

---

## 5. Control de Acceso por Roles (RBAC) y Protección de Rutas (SEC-STD-007)
- **Zero-Trust Client (CWE-602):** La seguridad real reside estrictamente en el Backend y Gateway. Ningún control de seguridad se delega al código que corre en el navegador del cliente.
- **Autorización Criptográfica en Backend:** Endpoints protegidos mediante decorador `@require_role([...])` que valida el claim `role` verificado en el token M2M firmado por el Gateway.
- **Defensa en Profundidad en Frontend (JavaScript Puro):**
  - **Guardia de Navegación (`authGuard.js`):** Intercepta la carga de vistas HTML contra una matriz declarativa de permisos de rutas (`ROUTE_PERMISSIONS`).
  - **Visibilidad Semántica de Interfaz (`data-role`):** Remoción de botones y elementos DOM no autorizados para el rol activo.
  - **Interceptor de Red Centralizado (`apiService.js`):** Captura respuestas `401` y `403` para revocar sesión o advertir al usuario sin exponer datos.

