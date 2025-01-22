import { config } from 'dotenv';
config();

export const CONFIG = {
    DATABASE_URL: process.env.DATABASE_URL!,
    PORT: parseInt(process.env.PORT || '3000'),
    NODE_ENV: process.env.NODE_ENV || 'development',
    STORAGE_PATH: process.env.STORAGE_PATH || './storage',
    REPORT_PATH: process.env.REPORT_PATH || './storage/reports',
    LOG_PATH: process.env.LOG_PATH || './storage/logs',
    STORAGE: {
        PATH: process.env.STORAGE_PATH || './storage',
        RETENTION_DAYS: parseInt(process.env.REPORT_RETENTION_DAYS || '30')
    }
};