// src/index.ts
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import { 
    generateWorkOrderReport, 
    getJobStatus, 
    downloadReport,
    listJobs 
} from './controllers/reportwo';
import { CONFIG } from './config';
import { Context } from './types';
import { initStorage } from './utils/storage';
import { scheduleCleanup } from './utils/cleanup';

// Initialize storage directories
initStorage();
scheduleCleanup();

// Create app with typed context
const app = new Hono<{ Variables: { userId: number } }>();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors());

// Middleware to set user ID (replace with your auth)
app.use('*', async (c, next) => {
    c.set('userId', 1);
    await next();
});

// Report endpoints
app.post('/api/reports/workorders', generateWorkOrderReport);
app.get('/api/reports/jobs/:jobId/status', getJobStatus);
app.get('/api/reports/jobs/:jobId/download', downloadReport);
app.get('/api/reports/jobs', listJobs);

// Start server
export default {
    port: CONFIG.PORT,
    fetch: app.fetch,
};