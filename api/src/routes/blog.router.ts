import { Router } from 'express';
import { createBlogPost, getAllBlogPosts, getBlogPostById, updateBlogPost, deleteBlogPost } from '../controllers/blog.controller';
import { hasRole } from '../middlewares/authorization.middleware';
import { isAuthenticated } from '../middlewares/authentication.middleware';

const router = Router();

router.post('/', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), createBlogPost);
router.get('/', getAllBlogPosts);
router.get('/:blogId', getBlogPostById);
router.put('/:blogId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), updateBlogPost);
router.delete('/:blogId', isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), deleteBlogPost);

export default router;
