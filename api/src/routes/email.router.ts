import express from "express";
import { sendEmailController, getEmailsController, fetchAndStoreEmailsController } from "../controllers/email.controller";

const router = express.Router();

router.post("/send", sendEmailController);
router.get("/all", getEmailsController);
router.get("/sync", fetchAndStoreEmailsController);

export default router;
