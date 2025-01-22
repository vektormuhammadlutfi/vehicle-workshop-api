import { cleanOldFiles } from './storage';
import logger from '../logging';
import { CONFIG } from '../config';

export function scheduleCleanup(intervalHours: number = 24) {
    // Run initial cleanup
    try {
        cleanOldFiles();
    } catch (error) {
        logger.app.error('Error during initial cleanup:', error);
    }

    // Schedule periodic cleanup
    setInterval(() => {
        try {
            cleanOldFiles();
            logger.app.info('Scheduled cleanup completed');
        } catch (error) {
            logger.app.error('Error during scheduled cleanup:', error);
        }
    }, intervalHours * 60 * 60 * 1000);

    logger.app.info(`Cleanup scheduled to run every ${intervalHours} hours`);
}