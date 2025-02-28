import Stripe from 'stripe';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import { config } from '../configs/config';
import { logger } from '../services/logger.service';

const stripe = new Stripe(config.gateways.payment.stripe, {
    apiVersion: '2025-02-24.acacia',
});

export class PaymentGatewayService {
    static async processPayment(paymentData: {
        paymentMethod: string;
        amount: number;
        currency: string;
        transactionId?: string;
        userId: string;
        products: { name: string; quantity: number; price: number }[];
    }) {
        try {
            const user = await User.findById(paymentData.userId);
            if (!user) {
                return { success: false, message: 'User not found' };
            }

            const description = paymentData.products
                .map(product => `${product.quantity}x ${product.name} ($${product.price * product.quantity})`)
                .join(', ');

            const paymentIntent = await stripe.paymentIntents.create({
                amount: paymentData.amount,
                currency: paymentData.currency,
                payment_method: paymentData.paymentMethod,
                confirm: true,
                capture_method: 'automatic',
                receipt_email: user.email,
                description,
            });

            if (!paymentIntent || paymentIntent.status !== 'succeeded') {
                throw new Error('Payment failed');
            }

            const newPayment = new Payment({
                paymentMethod: paymentData.paymentMethod,
                amount: paymentData.amount,
                currency: paymentData.currency,
                transactionId: paymentIntent.id,
                paymentDate: new Date(),
            });

            await newPayment.save();

            return { success: true, message: 'Payment processed successfully', payment: newPayment };
        } catch (error: any) {
            logger.error('Payment processing error:', { error: error.message, stack: error.stack });
            return { success: false, message: 'Payment processing failed', error: error.message };
        }
    }

    static async getAllPayments() {
        try {
            const payments = await Payment.find();
            return { success: true, payments };
        } catch (error: any) {
            logger.error('Error fetching payments:', { error: error.message, stack: error.stack });
            return { success: false, message: 'Error fetching payments', error: error.message };
        }
    }

    static async getPaymentById(paymentId: string) {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return { success: false, message: 'Payment not found' };
            }
            return { success: true, payment };
        } catch (error: any) {
            logger.error('Error fetching payment:', { error: error.message, stack: error.stack });
            return { success: false, message: 'Error fetching payment', error: error.message };
        }
    }

    static async deletePayment(paymentId: string) {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return { success: false, message: 'Payment not found' };
            }

            if (!payment.transactionId) {
                return { success: false, message: 'Transaction ID not found for the payment' };
            }

            const canceledPaymentIntent = await stripe.paymentIntents.cancel(payment.transactionId);

            if (canceledPaymentIntent.status !== 'canceled') {
                return { success: false, message: 'Failed to cancel payment intent' };
            }

            await Payment.findByIdAndDelete(paymentId);

            return { success: true, message: 'Payment deleted successfully' };
        } catch (error: any) {
            logger.error('Error deleting payment:', { error: error.message, stack: error.stack });
            return { success: false, message: 'Error deleting payment', error: error.message };
        }
    }
}
