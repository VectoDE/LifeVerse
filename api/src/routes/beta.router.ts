import { Router } from 'express';
import { createBetaKey, getAllBetaKeys, getBetaKeyById, updateBetaKey, deleteBetaKey, toggleBetaSystem } from '../controllers/beta.controller';
import { hasRole } from '../middlewares/authorization.middleware';
import { isAuthenticated } from '../middlewares/authentication.middleware';

const router = Router();

router.post('/key', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), createBetaKey);
router.get('/key', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getAllBetaKeys);
router.get('/key/:betaKeyId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getBetaKeyById);
router.put('/key/:betaKeyId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer'), updateBetaKey);
router.delete('/key/:betaKeyId', isAuthenticated, hasRole('Admin', 'Moderator'), deleteBetaKey);

router.post('/toggle', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), toggleBetaSystem);

export default router;
