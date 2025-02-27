import { Request, Response, RequestHandler } from 'express';
import { PaymentGatewayService } from '../services/paymentGateway.service';

export const createPayment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await PaymentGatewayService.processPayment(req.body);

        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllPayments: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const result = await PaymentGatewayService.getAllPayments();
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPaymentById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await PaymentGatewayService.getPaymentById(req.params.paymentId);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deletePayment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await PaymentGatewayService.deletePayment(req.params.paymentId);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};