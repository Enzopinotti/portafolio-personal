# Backend Dockerfile
FROM node:18-alpine

# Use an unprivileged user for security
USER node

WORKDIR /app

# Copy package files and install dependencies
COPY --chown=node:node package*.json ./
RUN npm ci --only=production

# Copy application code
COPY --chown=node:node . .

# Environment variables (can be overridden by docker-compose)
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "index.js"]
