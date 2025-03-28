# Stage 1: Build
FROM node:18 as builder

WORKDIR /build

COPY package*.json .
RUN npm install

COPY src/ src/
COPY tsconfig.json tsconfig.json

COPY .env .env 

RUN npm run build

# Stage 2: Run
FROM node:18 as runner

WORKDIR /app

COPY --from=builder /build/package*.json .
COPY --from=builder /build/node_modules/ node_modules/
COPY --from=builder /build/dist/ dist/
COPY --from=builder /build/.env .env    

CMD [ "npm", "start" ]