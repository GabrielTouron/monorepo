FROM node:lts-alpine

WORKDIR /app

# Add the backend user and group
RUN addgroup -S backend && adduser -S -G backend backend

COPY ./dist/apps/backend .

COPY node_modules/prisma/libquery_engine-linux-musl-openssl-3.0.x.so.node .

# ENV PRISMA_QUERY_ENGINE_LIBRARY=./libquery_engine-linux-musl-openssl-3.0.x.so.node

ENV NODE_ENV=production

# Set the ownership of the files to the backend user
RUN chown -R backend:backend .

# Run the main script as the backend user
USER backend

CMD [ "node", "main.cjs" ]

