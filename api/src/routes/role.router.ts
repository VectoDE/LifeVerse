import { Router } from 'express';
import { createRole, getAllRoles, getRoleById, updateRole, deleteRole } from '../controllers/role.controller';
import { hasRole } from '../middlewares/authorization.middleware';
import { isAuthenticated } from '../middlewares/authentication.middleware';

const router = Router();

router.post('/', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer'), createRole);
router.get('/', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getAllRoles);
router.get('/:roleId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getRoleById);
router.put('/:roleId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer'), updateRole);
router.delete('/:roleId', isAuthenticated, hasRole('Admin'), deleteRole);

export default router;
