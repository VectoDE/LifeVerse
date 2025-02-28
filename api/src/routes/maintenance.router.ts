import { Router } from 'express';
import { getMaintenanceStatus, updateMaintenanceStatus, deleteMaintenanceStatus } from '../controllers/maintenance.controller';
import { hasRole } from '../middlewares/authorization.middleware';
import { isAuthenticated } from '../middlewares/authentication.middleware';

const router = Router();

router.get('/', getMaintenanceStatus);
router.post('/', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), updateMaintenanceStatus);
router.delete('/', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), deleteMaintenanceStatus);

export default router;
