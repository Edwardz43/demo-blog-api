FROM node:17 as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package.json ./

COPY --chown=node:node . .
RUN npm install \
    && npx prisma generate --schema=./src/prisma/schema.prisma \
    && npm run build \
    && npm prune --production



FROM node:17

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/.env ./.env
COPY --from=builder --chown=node:node /home/node/start.sh ./start.sh
RUN chmod u+x start.sh

CMD ["node", "dist/main"]