import { Clerk } from '@clerk/clerk-sdk-node';
import { Payment } from '../models/Payment';

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export class PaymentGatewayService {
    /**
     * Erstellt eine Zahlung sowohl in Clerk als auch in der Datenbank
     */
    static async processPayment(paymentData: {
        paymentMethod: string;
        amount: number;
        currency: string;
        transactionId?: string;
    }) {
        try {
            // Zahlung über Clerk verarbeiten
            const transaction = await clerk.payments.create({
                amount: paymentData.amount,
                currency: paymentData.currency,
                method: paymentData.paymentMethod,
            });

            if (!transaction || transaction.status !== 'succeeded') {
                throw new Error('Payment failed');
            }

            // Zahlung in der Datenbank speichern
            const newPayment = new Payment({
                paymentMethod: paymentData.paymentMethod,
                amount: paymentData.amount,
                currency: paymentData.currency,
                transactionId: transaction.id,
                paymentDate: new Date(),
            });

            await newPayment.save();

            return { success: true, message: 'Payment processed successfully', payment: newPayment };
        } catch (error) {
            console.error('Payment processing error:', error);
            return { success: false, message: 'Payment processing failed' };
        }
    }

    /**
     * Holt alle Zahlungen aus der Datenbank
     */
    static async getAllPayments() {
        try {
            const payments = await Payment.find();
            return { success: true, payments };
        } catch (error) {
            console.error('Error fetching payments:', error);
            return { success: false, message: 'Error fetching payments' };
        }
    }

    /**
     * Holt eine einzelne Zahlung per ID
     */
    static async getPaymentById(paymentId: string) {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return { success: false, message: 'Payment not found' };
            }
            return { success: true, payment };
        } catch (error) {
            console.error('Error fetching payment:', error);
            return { success: false, message: 'Error fetching payment' };
        }
    }

    /**
     * Aktualisiert eine Zahlung sowohl in Clerk als auch in der Datenbank
     */
    static async updatePayment(paymentId: string, updateData: Partial<{ paymentMethod: string; amount: number; currency: string }>) {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return { success: false, message: 'Payment not found' };
            }

            // Zahlung in Clerk aktualisieren
            await clerk.payments.update(payment.transactionId, {
                amount: updateData.amount ?? payment.amount,
                currency: updateData.currency ?? payment.currency,
                method: updateData.paymentMethod ?? payment.paymentMethod,
            });

            // Zahlung in der Datenbank aktualisieren
            Object.assign(payment, updateData);
            await payment.save();

            return { success: true, message: 'Payment updated successfully', payment };
        } catch (error) {
            console.error('Error updating payment:', error);
            return { success: false, message: 'Error updating payment' };
        }
    }

    /**
     * Löscht eine Zahlung sowohl in Clerk als auch in der Datenbank
     */
    static async deletePayment(paymentId: string) {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return { success: false, message: 'Payment not found' };
            }

            // Zahlung in Clerk löschen
            await clerk.payments.delete(payment.transactionId);

            // Zahlung in der Datenbank löschen
            await Payment.findByIdAndDelete(paymentId);

            return { success: true, message: 'Payment deleted successfully' };
        } catch (error) {
            console.error('Error deleting payment:', error);
            return { success: false, message: 'Error deleting payment' };
        }
    }
}