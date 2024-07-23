import express from "express";
import { homepage, about } from "../controllers/mainController.js";

const router = express.Router();

// App routes

router.get("/", homepage);
router.get("/about", about);

export default router;