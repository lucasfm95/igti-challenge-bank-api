import express from "express";
import { getAll, credit, debit, getByAgenciaAndConta, removeAccount, transferValue, getAvarageByAgencia, getListMinValues, getListMaxValues, setListVip } from "../controllers/accountsController.js";

const router = express.Router();

router.get("/", getAll);
router.get("/params", getByAgenciaAndConta);
router.get("/average", getAvarageByAgencia);
router.get("/minValues", getListMinValues);
router.get("/maxValues", getListMaxValues);
router.post("/credit/", credit);
router.post("/debit/", debit);
router.post("/transfer/", transferValue);
router.post("/lisVip/", setListVip);
router.delete("/", removeAccount);

export default router;