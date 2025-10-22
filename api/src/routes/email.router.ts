import express from "express";
import { sendEmailController, getEmailsController, fetchAndStoreEmailsController } from "../controllers/email.controller";
import { hasRole } from '../middlewares/authorization.middleware';
import { isAuthenticated } from '../middlewares/authentication.middleware';

const router = express.Router();

router.post("/send", isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), sendEmailController);
router.get("/", isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), getEmailsController);
router.get("/sync", isAuthenticated, hasRole('Admin', 'Moderator', 'Developer', 'Content', 'Supporter'), fetchAndStoreEmailsController);

export default router;
