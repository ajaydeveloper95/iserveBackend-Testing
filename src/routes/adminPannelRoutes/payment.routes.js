import express from "express";
import { GenTrxIserve, marwarpayGen, payInCallBack, payInCallBackTest, payOutCallBack, payOutCallBackTest, zanithPayGen } from "../../controllers/adminPannelControllers/payment.controller.js";
const router = express.Router();
import multer from "multer";
const upload = multer();
import { celebrate, Joi } from "celebrate";

router.post("/GenTrx", celebrate({
    body: Joi.object({
        secureKey: Joi.string().required(),
        mobileNumber: Joi.number().required(),
        accountHolderName: Joi.string().required(),
        accountNumber: Joi.string().required(),
        ifscCode: Joi.string().required(),
        bankName: Joi.string().required(),
        trxId: Joi.string().min(10).max(25).required(),
        amount: Joi.number().required(),
    })
}), GenTrxIserve);

router.get("/zanithPayGen", zanithPayGen);

router.get("/marwarpayGen", marwarpayGen);

router.post("/payIn", payInCallBack);
router.post("/payInTest", payInCallBackTest);
router.post("/payOut", upload.none(), payOutCallBack);
router.post("/payOutTest", payOutCallBackTest);


export default router;