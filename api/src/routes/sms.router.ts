import { Router } from 'express';
import { sendSms, sendReminder, getAllSms, getSmsById } from '../controllers/sms.controller';

const router = Router();

router.post('/send', sendSms);
router.post('/reminder', sendReminder);
router.get('/', getAllSms);
router.get('/:smsId', getSmsById);

export default router;
