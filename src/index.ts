import { Hono } from "hono";
import { cors } from "hono/cors";

import { router } from "./routes";

// Initialize the Hono app
const app = new Hono();

// Configure CORS options
const corsOptions = {
  origin: '*', // Allow frontend's origin
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  exposedHeaders: ['Content-Length', 'X-Kuma-Revision'], // Any headers you'd like to expose
  credentials: true, // If you are using cookies
};

// Use the CORS middleware for all routes
app.use(cors(corsOptions));

// Mount routes
app.get("/", (c) => c.json({ message: "Vehicle Workshop API", api: "/api" }));
app.basePath("/api").route("/", router);

// Start the server with specified port using Bun.serve
const port = process.env.PORT || 3000; // You can change this port

Bun.serve({
  fetch: app.fetch, // The handler for requests
  port: port, // Specify the port here
});

console.log(`Server running on http://localhost:${port}`);
