import express from "express";
import { getAll } from "../controllers/accountsController.js";

const router = express.Router();

router.get("/", getAll);

export default router;