import { Router } from 'express';
import { sendSms, sendReminder, getAllSms, getSmsById, getAllReminders, getReminderById } from '../controllers/sms.controller';
import { hasRole } from '../middlewares/authorization.middleware';
import { isAuthenticated } from '../middlewares/authentication.middleware';

const router = Router();

router.post('/send', isAuthenticated, sendSms);
router.post('/reminder', isAuthenticated, sendReminder);
router.get('/', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getAllSms);
router.get('/:smsId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getSmsById);
router.get('/reminders', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getAllReminders);
router.get('/reminders/:reminderId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getReminderById);

export default router;
