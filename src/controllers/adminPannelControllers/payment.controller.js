import { ApiResponse } from "../../utils/ApiResponse.js"
import PaymentModel from "../../models/user.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import multiparty from "multiparty"
import axios from "axios"
import FormData from "form-data"
import { AESUtils } from "../../utils/CryptoEnc.js";

export const GenTrxIserve = asyncHandler(async (req, res) => {
    const { secureKey, mobileNumber, accountHolderName, accountNumber, ifscCode, trxId, amount, bankName } = req.body;

    if (secureKey !== "80001") {
        return res.status(401).json({ message: "Failed", data: "Unauthorized Access !" })
    }
    const url = "https://api-prod.txninfra.com/encrV1/w1w2-payout/w1/cashtransfer";
    const passKey = "Fv5S9m79z7rUq0LG7NE4VW4GIICNPaZYPnngonlvdkxNU902";
    const EncKey = "8LWVEmyHYcJZjjB0WW2VQ+YDttzua5BGMnOX66Vi5KE=";
    let HeaderObj = {
        client_id: "ZYSEZxHszNlEzMuihWIltIqClSVFqqQeUbPYTfpjKMQiDXKJ",
        client_secret: "r5kOP0Rdxj4qYjbRFHyUKHetEGTOH1ZaHUgz4p5xqFw3aYxVvGDuFrGcHDKKudFa",
        epoch: String(Date.now())
    }

    let BodyObj = {
        beneName: accountHolderName,
        beneAccountNo: accountNumber,
        beneifsc: ifscCode,
        benePhoneNo: mobileNumber,
        clientReferenceNo: trxId,
        amount: amount,
        fundTransferType: "IMPS",
        latlong: "22.8031731,88.7874172",
        pincode: 302012,
        custName: accountHolderName,
        custMobNo: mobileNumber,
        custIpAddress: "148.135.138.148",
        beneBankName: bankName,
    }

    let headerSecrets = await AESUtils.EncryptRequest(HeaderObj, EncKey)
    let BodyRequestEnc = await AESUtils.EncryptRequest(BodyObj, EncKey)
    let postApiOptions = {
        headers: {
            'header_secrets': headerSecrets,
            'pass_key': passKey,
            'Content-Type': 'application/json'
        }
    };
    let payoutApiDataSend =
    {
        RequestData: BodyRequestEnc
    }

    // Banking api calling
    axios.post(url, payoutApiDataSend, postApiOptions).then(async (data) => {
        let bankServerResp = data?.data?.ResponseData
        console.log(data?.data)
        // decrypt the data and send to client;
        let BodyResponceDec = await AESUtils.decryptRequest(bankServerResp, EncKey);
        let BankJsonConvt = await JSON.parse(BodyResponceDec)
        return res.status(200).json(new ApiResponse(200, BankJsonConvt))
    }).catch((err) => {
        let errResp = err?.response?.data
        console.dir(errResp)
        return res.status(err?.response?.status).json({ message: "Failed", data: errResp })
    })
})
export const payInCallBack = asyncHandler(async (req, res) => {
    console.log(req.body, "payin CallBack URL")
    res.status(200).json(new ApiResponse(200, req.body))
})

export const payInCallBackTest = asyncHandler(async (req, res) => {
    console.log(req.body, "payin CallBack URL test")
    res.status(200).json(new ApiResponse(200, req.body))
})

export const payOutCallBack = asyncHandler(async (req, res) => {
    console.log(req.body, "req.body")
    res.status(200).json(new ApiResponse(200, req.body))
})

export const payOutCallBackTest = asyncHandler(async (req, res) => {
    console.log(req.body, "payout CallBack URL test")
    res.status(200).json(new ApiResponse(200, req.body))
})




