FROM node:20-slim as development

USER node

RUN mkdir /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .

CMD [ "tail", "-f", "/dev/null" ]

# Build stage

FROM node:20-slim as builder

USER node

RUN mkdir /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node --from=development /home/node/app ./
RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production

# Production stage

FROM node:20-slim as production

USER node

RUN mkdir /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node --from=builder /home/node/app/dist ./dist
COPY --chown=node:node --from=builder /home/node/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /home/node/app/package.json ./

EXPOSE 3333

ENV NODE_ENV production

CMD [ "npm", "run", "start:prod" ]
