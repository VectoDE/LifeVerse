import { Router } from 'express';
import { createApiKey, getAllApiKeys, getApiKeyById, updateApiKey, deleteApiKey } from '../controllers/apikey.controller';
import { hasRole } from '../middlewares/authorization.middleware';
import { isAuthenticated } from '../middlewares/authentication.middleware';

const router = Router();

router.post('/', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer'), createApiKey);
router.get('/', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getAllApiKeys);
router.get('/:apiKeyId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getApiKeyById);
router.put('/:apiKeyId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer'), updateApiKey);
router.delete('/:apiKeyId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer'), deleteApiKey);

export default router;
