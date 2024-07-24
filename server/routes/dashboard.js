import express from "express";

import { dashboard, dashboardViewNote, dashboardUpdateNote, dashboardDeleteNote, dashboardAddNote, dashboardAddNoteSubmit, dashboardSearch, dashboardSearchSubmit } from "../controllers/dashboardController.js";
import { isLoggedIn } from "../middleware/checkAuth.js";

const router = express.Router();

/*
Dashboard routes
*/

router.get("/dashboard", isLoggedIn, dashboard);
router.get("/dashboard/item/:id", isLoggedIn, dashboardViewNote);
router.post("/dashboard/item/:id", isLoggedIn, dashboardUpdateNote);
router.post("/dashboard/item-delete/:id", isLoggedIn, dashboardDeleteNote);
router.get("/dashboard/add", isLoggedIn, dashboardAddNote);
router.post("/dashboard/add", isLoggedIn, dashboardAddNoteSubmit);
router.get("/dashboard/search", isLoggedIn, dashboardSearch);
router.post("/dashboard/search", isLoggedIn, dashboardSearchSubmit);

export default router;

