FROM docker.io/node:lts-alpine

WORKDIR /app

RUN addgroup --system backend && \
          adduser --system -G backend backend

COPY ./dist/apps/backend dist

RUN chown -R backend:backend .

CMD [ "node", "dist/main.cjs" ]
