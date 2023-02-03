FROM node:lts-alpine

WORKDIR /app

# Add the backend user and group
RUN addgroup -S backend && adduser -S -G backend backend

COPY ./dist/apps/backend ./apps/backend/prisma dist/

# Set the ownership of the files to the backend user
RUN chown -R backend:backend .

# Run the main script as the backend user
USER backend
CMD [ "node", "dist/main.cjs" ]

