import express from "express";
import { getAll, credit, debit, getByAgenciaAndConta } from "../controllers/accountsController.js";

const router = express.Router();

router.get("/", getAll);
router.get("/params", getByAgenciaAndConta);
router.post("/credit/", credit);
router.post("/debit/", debit);

export default router;