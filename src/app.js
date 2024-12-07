import express from "express";
import cors from "cors";
const app = express();
import cookieParser from "cookie-parser";
import userRoutes from "./routes/adminPannelRoutes/user.routes.js";
import paymentRoutes from "./routes/adminPannelRoutes/payment.routes.js";
import { errors } from "celebrate";

// for use body data
app.use(
    express.json({
        limit: "16kb",
    })
);

const corsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
};

// Use CORS middleware
app.use(cors(corsOptions));

// for use urlencoded with different
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// for use static file serve
app.use(express.static("public"));

// for use secure cookies manuplation
app.use(cookieParser());

// api Route for user -- Admin
app.use("/apiAdmin/v1/user/", userRoutes);

// api Route for user -- Admin
app.use("/payment/", paymentRoutes);

// Joi Vaidator error middlewares setup
app.use(errors());

app.all("*",(req,res)=>{
res.status(200).json({message:"not route found !"})
})

export default app;
