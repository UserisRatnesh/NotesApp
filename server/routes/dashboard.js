import express from "express";

import { dashboard, dashboardViewNote, dashboardUpdateNote } from "../controllers/dashboardController.js";
import { isLoggedIn } from "../middleware/checkAuth.js";

const router = express.Router();

/*
Dashboard routes
*/

router.get("/dashboard", isLoggedIn, dashboard);
router.get("/dashboard/item/:id", isLoggedIn, dashboardViewNote);
router.post("/dashboard/item/:id", isLoggedIn, dashboardUpdateNote);


export default router;