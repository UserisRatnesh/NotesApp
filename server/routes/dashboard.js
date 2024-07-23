import express from "express";

import { dashboard } from "../controllers/dashboardController.js";
import { isLoggedIn } from "../middleware/checkAuth.js";

const router = express.Router();

/*
Dashboard routes
*/

router.get("/dashboard", isLoggedIn, dashboard);


export default router;