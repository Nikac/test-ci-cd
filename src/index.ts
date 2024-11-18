import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import fs from "fs";
import https from "https";
import http from "http";

import { ErrorMiddleware } from "./middlewares/error.middleware";
import { recordsRouter } from "./routes/records.router";
import { connectDB } from "./db/db";
import { resolvers } from "./resolvers/record.resolver";
import { typeDefs } from "./schemas/record.schema";
import { expressMiddleware } from "@apollo/server/express4";
import { authRouter } from "./routes/auth.router";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

let privateKey, certificate;
try {
  privateKey = fs.readFileSync(process.env.PRIVATE_KEY!);
  certificate = fs.readFileSync(process.env.CERTIFICATE_PATH!);
} catch (err) {
  console.log(`Error in key and cerificate: ${err}`);
  process.exit(1); // Exit the application on error
}
const options = {
  key: privateKey,
  cert: certificate,
};

connectDB();

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});

http
  .createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  })
  .listen(80);

app.use(cors());
app.use(express.json());

app.use("/records", recordsRouter);
app.use("/auth", authRouter);

// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
async function startAppoloServer() {
  await server.start();
  app.use("/graphql", cors(), express.json(), expressMiddleware(server));
}

startAppoloServer();

app.use(ErrorMiddleware);
