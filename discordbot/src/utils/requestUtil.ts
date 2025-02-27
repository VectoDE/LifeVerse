import axios from 'axios';
import { Request } from '../models/Request';
import { LogService } from '../services/logService';

export async function makeRequest(type: string, url?: string, data?: any): Promise<{ status: number; data?: any } | null> {
    if (!url) {
        LogService.warn('No URL provided for request');
        return null;
    }

    try {
        const response = await axios.get(url, { timeout: 5000 });

        await Request.create({
            url,
            type,
            data,
            status: response.status,
            timestamp: new Date(),
        });

        return { status: response.status, data: response.data };
    } catch (error) {
        await Request.create({
            url,
            type,
            data,
            status: 'failed',
            timestamp: new Date(),
        });

        return null;
    }
}
