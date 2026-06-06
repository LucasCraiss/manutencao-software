# ================================================================
# Dockerfile — Frontend Vue 3
# Estratégia: Multi-stage build
#
# Conceito aplicado (DevOps): o multi-stage build resolve o problema
# de "funciona na minha máquina" ao criar um ambiente reproduzível.
# Stage 1 (build) compila o Vue; Stage 2 (prod) serve apenas os
# arquivos estáticos via Nginx — imagem final <25MB.
# ================================================================

# ── Stage 1: Build ────────────────────────────────────────────────
FROM node:18-alpine AS builder

LABEL stage="builder"
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (cache layer)
COPY package*.json ./
RUN npm ci --only=production=false

# Copia o restante do código e compila
COPY . .
RUN npm run build

# ── Stage 2: Produção (Nginx) ────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Remove configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia configuração customizada
COPY nginx.conf /etc/nginx/conf.d/

# Copia os arquivos compilados do Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check para o Docker Compose e orquestradores
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
