import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";

import * as reportService from "@/modules/report/service";
import * as jobsService from "@/modules/jobs/service";

import { CONFIG } from "@/config";
import { initStorage } from "@/utils/storage";
import { scheduleCleanup } from "@/utils/cleanup";

// Initialize storage directories
initStorage();
scheduleCleanup();

// Create app with typed context
const app = new Hono<{ Variables: { userId: number } }>();

// Middleware
app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", cors());

// Middleware to set user ID (replace with your auth)
app.use("*", async (c, next) => {
  c.set("userId", 1);
  await next();
});

// Report endpoints
app.post("/api/reports/work-orders", reportService.generateWorkOrderReport);
app.get("/api/jobs/:jobId/status", jobsService.getJobStatus);
app.get("/api/jobs/:jobId/download", jobsService.downloadReport);
app.get("/api/jobs", jobsService.listJobs);

// TODO
// IDEAL: "/api/reports" > reportsRouter > reportsService / reportsController
// MIDDLEWARE: Authorization: Bearer {jwtToken} via hono/jwt

// Start server
export default {
  port: CONFIG.PORT,
  fetch: app.fetch,
};
