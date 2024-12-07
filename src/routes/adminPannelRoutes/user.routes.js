import express from "express";
import { getUser, addUser, loginUser, logOut, getSingleUser, updateUser } from "../../controllers/adminPannelControllers/user.controller.js";
import { celebrate, Joi } from "celebrate";
import { userVerify, userAuthAdmin } from "../../middlewares/userAuth.js";
const router = express.Router();

router.get("/getUsers", userVerify, getUser);

router.get("/userProfile/:id", celebrate({
    params: Joi.object({
        id: Joi.string().trim().length(24).required(),
    })
}), userVerify, getSingleUser);

router.post("/addUser", celebrate({
    body: Joi.object({
        email: Joi.string().required(),
        memberType: Joi.string().valid("Admin", "Users").required(),
        fName: Joi.string().required(),
        lName: Joi.string().required(),
        password: Joi.string().required(),
        addresh: Joi.object({
            country: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            addresh: Joi.string().required(),
            pincode: Joi.number().required()
        }),
        isActive: Joi.boolean().required(),
    })
}), addUser)

router.post("/updateUser/:id", celebrate({
    body: Joi.object({
        email: Joi.string().optional(),
        memberType: Joi.string().valid("Admin", "Users").optional(),
        fName: Joi.string().optional(),
        lName: Joi.string().optional(),
        password: Joi.string().optional(),
        addresh: Joi.object({
            country: Joi.string().optional(),
            state: Joi.string().optional(),
            city: Joi.string().optional(),
            addresh: Joi.string().optional(),
            pincode: Joi.number().optional()
        }),
        isActive: Joi.boolean().optional(),
    }),
    params: Joi.object({
        id: Joi.string().trim().length(24).required(),
    })
}), userVerify, userAuthAdmin, updateUser)

router.post("/login", celebrate({
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
}), loginUser)

router.get("/logout", userVerify, logOut)

export default router;