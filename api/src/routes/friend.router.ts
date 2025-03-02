import { Router } from 'express';
import { sendFriendRequest, respondToFriendRequest, getFriends } from '../controllers/friend.controller';
import { isAuthenticated } from '../middlewares/authentication.middleware';

const router = Router();

router.post("/send", isAuthenticated, sendFriendRequest);
router.post("/respond", isAuthenticated, respondToFriendRequest);
router.get("/:userId", isAuthenticated, getFriends);

export default router;