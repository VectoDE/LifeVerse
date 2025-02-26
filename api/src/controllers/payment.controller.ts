import { Request, Response, RequestHandler } from 'express';
import { Payment } from '../models/Payment';

export const createPayment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { paymentMethod, amount, currency, paymentDate, transactionId } = req.body;

        const newPayment = new Payment({
            paymentMethod,
            amount,
            currency,
            paymentDate,
            transactionId,
        });

        await newPayment.save();

        res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getAllPayments: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getPaymentById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { paymentId } = req.params;

    try {
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }

        res.status(200).json(payment);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const updatePayment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { paymentId } = req.params;
    const { paymentMethod, amount, currency, paymentDate, transactionId } = req.body;

    try {
        const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            { paymentMethod, amount, currency, paymentDate, transactionId },
            { new: true }
        );

        if (!updatedPayment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }

        res.status(200).json({ message: 'Payment updated successfully', payment: updatedPayment });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const deletePayment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { paymentId } = req.params;

    try {
        const deletedPayment = await Payment.findByIdAndDelete(paymentId);

        if (!deletedPayment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }

        res.status(200).json({ message: 'Payment deleted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
