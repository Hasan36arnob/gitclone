import express from "express";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";
import { checkout } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/checkout", ensureAuthenticated, checkout);

export default router;
