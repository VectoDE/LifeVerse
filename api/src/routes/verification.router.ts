import { Router } from "express";
import { createVerification, verifyUser, getVerificationStatus } from "../controllers/verification.controller";
import { hasRole } from '../middlewares/authorization.middleware';
import { isAuthenticated } from '../middlewares/authentication.middleware';

const router = Router();

router.post("/", isAuthenticated, createVerification);
router.post("/verify", isAuthenticated, verifyUser);
router.get("/status/:userId", isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getVerificationStatus);

export default router;
