import { Router } from 'express';
import { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment } from '../controllers/payment.controller';
import { hasRole } from '../middlewares/authorization.middleware';
import { isAuthenticated } from '../middlewares/authentication.middleware';

const router = Router();

router.post('/', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), createPayment);
router.get('/', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getAllPayments);
router.get('/:paymentId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getPaymentById);
router.put('/:paymentId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), updatePayment);
router.delete('/:paymentId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), deletePayment);

export default router;
