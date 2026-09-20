# ==============================================================================
# Dockerfile Multi-Stage Rootless: Ajedrez Junvill
# Fábrica Autónoma de Software Ikusi • Estándar ARCH-STD-002 & SEC-STD-003
# ==============================================================================

# Etapa 1: Compilación de activos estáticos
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar definiciones de dependencias
COPY package*.json ./

# Instalación limpia y reproducible
RUN npm ci --ignore-scripts

# Copiar código fuente
COPY . .

# Compilación de producción
RUN npm run build

# Etapa 2: Servidor Nginx rootless hardened
FROM nginxinc/nginx-unprivileged:alpine-slim AS runner

# Copiar configuración personalizada Nginx
COPY --chown=10001:10001 nginx.conf /etc/nginx/conf.d/default.conf

# Copiar bundle optimizado desde la etapa de construcción
COPY --from=builder --chown=10001:10001 /app/dist /usr/share/nginx/html

# Usuario sin privilegios forzado (CWE-250)
USER 10001

EXPOSE 8080

# Verificación de salud nativa
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
