import { Request, Response, RequestHandler } from 'express';
import { Maintenance } from '../models/Maintenance';
import { logger } from '../services/logger.service';

export const getMaintenanceStatus: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        logger.info('Fetching maintenance status');
        
        const maintenance = await Maintenance.findOne();
        if (maintenance) {
            logger.info('Maintenance status fetched successfully', { isActive: maintenance.isActive, title: maintenance.title });
        } else {
            logger.warn('No maintenance record found, returning default status');
        }
        
        res.status(200).json(maintenance || { isActive: false });
    } catch (error: any) {
        logger.error('Fetching maintenance status failed', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error fetching maintenance status', error: error.message });
    }
};

export const updateMaintenanceStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { isActive, title, message } = req.body;

    try {
        logger.info('Updating maintenance status', { isActive, title, message });

        let maintenance = await Maintenance.findOne();

        if (!maintenance) {
            maintenance = new Maintenance({ isActive, title, message });
            logger.info('No existing maintenance found, creating new maintenance record');
        } else {
            maintenance.isActive = isActive;
            maintenance.title = title;
            maintenance.message = message;
            logger.info('Existing maintenance found, updating maintenance record');
        }

        await maintenance.save();
        logger.info('Maintenance status updated successfully', { isActive, title });
        res.status(200).json({ message: 'Maintenance status updated successfully', maintenance });
    } catch (error: any) {
        logger.error('Updating maintenance status failed', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error updating maintenance status', error: error.message });
    }
};

export const deleteMaintenanceStatus: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        logger.info('Removing maintenance status');
        
        await Maintenance.deleteMany();
        logger.info('Maintenance status removed successfully');
        
        res.status(200).json({ message: 'Maintenance status removed successfully' });
    } catch (error: any) {
        logger.error('Removing maintenance status failed', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error deleting maintenance status', error: error.message });
    }
};
